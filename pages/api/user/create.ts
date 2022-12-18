import type { NextApiRequest, NextApiResponse } from 'next';

//TODO: create a test user in the database
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ name: 'John Doe' });
}
