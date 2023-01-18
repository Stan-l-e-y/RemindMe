import type { NextApiRequest, NextApiResponse } from 'next';
// import { createUser } from '../../../services/user';
// import { UserInput } from '../../../types/user.schema';
import validate from '@/lib/validateResource';
import { createEventSchema, EventInput } from '@/types/event.schema';
import { ZodError } from 'zod';
import { verifyJwt } from '@/lib/jwt.utils';
import { createEvent } from '@/services/event';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method === 'POST') {
    try {
      const createEventBody = validate(createEventSchema)(req);

      const accesstoken =
        (res.getHeader('x-access-token') as string) ||
        (req.cookies.accessToken as string);

      const { decoded } = await verifyJwt(
        accesstoken,
        'ACCESS_TOKEN_PUBLIC_KEY'
      );

      if (decoded) {
        const event = await createEvent(
          createEventBody as EventInput,
          decoded.id as number
        );
        console.log(event);
        return res.status(201).json(event);
      }

      return res.status(401).json({ error: 'Unauthorized' });
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: error.message });
      } else {
        console.log(error);
        res.status(409).json({ error });
      }
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
