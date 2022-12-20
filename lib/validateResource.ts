import type { NextApiRequest } from 'next';

import { AnyZodObject, ZodError } from 'zod';

const validate = (schema: AnyZodObject) => (req: NextApiRequest) => {
  try {
    return schema.parse({
      body: req.body,
      params: req.query,
    });
  } catch (error: any) {
    throw new ZodError(error);
  }
};
export default validate;
