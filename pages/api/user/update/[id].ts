import type { NextApiRequest, NextApiResponse } from 'next';
import {
  UpdateUserInput,
  updateUserSchema,
} from '../../../../types/user.schema';
import { updateUser } from '../../../../services/user';
import validate from '../../../../lib/validateResource';
import { ZodError } from 'zod';
import { omit } from 'lodash';

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
