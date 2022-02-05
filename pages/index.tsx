import Head from 'next/head'
import Header from '../components/Header'
import Banner from '../components/Banner'
import {sanityClient,urlFor} from '../sanity'
import Link from 'next/link'

export default function Home({ posts }) {
  
  
  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>Medium Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <Banner />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-2 gap-3  md:gap-6 md:p-6">
        {posts.map(post => (
        <Link href={`/post/${post.slug.current}`}>
          <div className="group cursor-pointer border rounded-lg overflow-hidden">
            <img className="h-60 w-full object-cover group-hover:scale-105 transition-transform duration-150 ease-in-out " src={urlFor(post.mainImage).url()!} alt="" />
            <div className=" flex justify-between p-5 bg-white">
              <div>
                <p className="text-md font-bold">{post.title}</p>
                <p className="text-sm">
                  {post.description} by {post.author.name}
                </p>
              </div>
              <img className='h-12 w-12 rounded-full object-cover' src={urlFor(post.author.image).url()!} alt="" />
            </div>
          </div>
        </Link>
      ))}
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  const query = `*[_type == "post"]{
  _id,
  title,
  description,
  mainImage,
  slug,
  author -> {name,image},
}`;
  
  const posts = await sanityClient.fetch(query);

  return {
    props: {
      posts,
    }
  }

  
}