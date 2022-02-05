import React from 'react';
import Header from '../../components/Header';
import { sanityClient, urlFor } from '../../sanity'
import PortableText from 'react-portable-text'
import {useForm,SubmitHandler} from 'react-hook-form'
function SlugPost({ post }) {
  
  const { register, handleSubmit, formState: { errors }, } = useForm();
  
  const onSubmit = async (data) => {
    await fetch("/api/createComment", {
      method: 'POST',
      body: JSON.stringify(data),
  }).then(() => console.log(data)).catch((err) => console.log(err)
  );
  
  
}

  return <main>
    <Header />
    <img src={urlFor(post.mainImage).url()!} alt="" className="w-full h-44 object-cover" />

    <article className="max-w-3xl mx-auto p-5">
      <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
      <h2 className="text-xl font-light text-gray-500 mb-2">{post.description}</h2>
      <div className="flex items-center space-x-2">
        <img className="h-10 rounded-full object-cover w-10" src={urlFor(post.author.image).url()!} alt="" />
        <p className="font-extralight text-sm text-gray-600">Blog post by <span className="font-semibold">{post.author.name}</span>- published at {new Date(post.createdAt).toLocaleString() }</p>
      </div>

      <div className="mt-10">
        
        <PortableText
          projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
        dataset= {process.env.NEXT_PUBLIC_SANITY_DATASET}
      // Pass in block content straight from Sanity.io
      content={post.body}
      // Optionally override marks, decorators, blocks, etc. in a flat
      // structure without doing any gymnastics
      serializers={{
       
          h1: (props :any) => (<h1 className="text-2xl font-bold my-5" {...props}></h1>),
          h2: (props: any) => (<h2 className="text-xl font-bold my-5" {...props}></h2>),
          p:(props: any) => (<p className="text-sm my-5" {...props} />)
      }}
    />
</div>


    </article>

    <hr className="max-w-3xl my-5 mx-auto  "/>

    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-2xl  flex flex-col p-5 mb-10" action="">

      <h3 className="text-sm text-yellow-500">Enjoyed this article?</h3>
      <h4 className="text-3xl font-bold">Leave a comment below!</h4>
      <hr className="py-3 mt-2" />

      <input type="hidden"  value={post._id}  {...register("_id")}/>


      <label className="block mb-5">
        <span className="text-gray-700">Name</span>
        <input {...register("name",{required:true})} type="text" placeholder="Mike Coxlong" className="inp"/>
      </label>
      <label className="block mb-5">
        <span className="text-gray-700">Email</span>
        <input {...register("email",{required:true})} type="email" placeholder="example@gmail.com" className="inp" />
      </label>
      <label className="block mb-5">
        <span className="text-gray-700">Comments</span>
        <textarea {...register("comments",{required:true})}rows={8} className="inp"  />
      </label>

      <div className="flex flex-col p-5">
        {errors.name && (
          <span className="text-red-500">-The Name field is missing</span>
        )}
        {errors.email && (
          <span className="text-red-500">-The Email field can't be empty</span>
        )}
        {errors.comments && (
          <span className="text-red-500">-The Comment field can't be empty</span>
        )}
      </div>
      
      <button type="submit" className="bg-yellow-500 shadow hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer">Submit</button>




    </form>

    {/* Comments */}

    <div className="flex flex-col p-10 my-10 max-w-2xl mx-auto shadow-yellow-500 shadow space-y-2">
      <h3 className="text-4xl">Comments</h3>
      <hr className="pb-2"/>
      {post.comments.map((comment) => (<div key={comment._id}>
        <p><span className="text-yellow-500">{comment.name}: </span>{comment.comments }</p>
      </div>))}
    </div>

  </main>
}

export default SlugPost;

export async function getStaticPaths() {
  const query = `*[_type == "post"]{
  _id,
  slug{
  current
}
}`;
  
  const posts = await sanityClient.fetch(query);
  const paths = posts.map(post => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
  
};

export async function getStaticProps({ params }) {
  
  
  const query = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  createdAt,
  title,
  author->{
    name,
    image
  },
  description,mainImage,slug,body,
  'comments': *[ _type == "comment" && post._ref==^._id && approved==true],
  
}`

  
  const post = await sanityClient.fetch(query, {
    slug:params?.slug,
  });
  console.log(post);
  if (!post) {
    return {
      notFound:true
    }
  }

  return {
    props: {
      post,
    },
    revalidate:60,
  }
  
}