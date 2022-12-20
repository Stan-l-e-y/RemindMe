import type { NextApiRequest, NextApiResponse } from 'next';
import {
  UpdateUserInput,
  updateUserSchema,
} from '../../../../types/user.schema';
import { updateUser } from '../../../../services/user';
import validate from '../../../../lib/validateResource';
import { ZodError } from 'zod';
import { omit } from 'lodash';

//TODO: create the prisma middleware for pre save and console.log anything to see if it works
//TODO: create the handler to update the user in the database
//i might not needs this prisma middleware, i can create an updateUserInput schema
//and use that to validate the request body, if the password is not provided, then
//i can just update the user without updating the password
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method === 'PUT') {
    try {
      let updateUserBody = validate(updateUserSchema)(req);

      const id = Number(req.query.id);

      if (updateUserBody.body.passwordConfirmation) {
        updateUserBody = omit(updateUserBody, 'body.passwordConfirmation');
      }

      const user = await updateUser(id, updateUserBody.body as UpdateUserInput);

      res.status(200).json(user);
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(409).json({ error: error.message });
      }
    }
  } else {
    res.setHeader('Allow', 'PUT');
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
