// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import sanityClient from "@sanity/client"

export const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2022-02-03', // use current UTC date - see "specifying API version"!
  token:process.env.SANITY_API_TOKEN,
  useCdn: process.env.NODE_ENV === 'production',
}

const client = sanityClient(config);


export default async function createComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { _id, name, email, comments } = JSON.parse(req.body);

  try {
    await client.create({
      _type: "comment",
      post: {
        _type: "reference",
        _ref: _id,
      },
      name, email, comments,

    });
    
  }

  catch (err) {
    return res.status(500).json({ message: `Couldn't submit comment`, err });
  }

  console.log("Comment Submitted");
  return res.status(200).json({ message: "Comment submitted" });


}
