import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

//TODO: create the prisma middleware for pre save and console.log anything to see if it works
//TODO: create the handler to update the user in the database
//i might not needs this prisma middleware, i can create an updateUserInput schema
//and use that to validate the request body, if the password is not provided, then
//i can just update the user without updating the password
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ name: 'John Doe' });
}
