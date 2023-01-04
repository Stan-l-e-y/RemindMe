import { NextApiRequest, NextApiResponse } from 'next';
import { updateSession } from '../../../services/session';
import { verifyJwt } from '../../../lib/jwt.utils';
import Cookies from 'cookies';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method === 'DELETE') {
    const accesstoken =
      (res.getHeader('x-access-token') as string) ||
      (req.cookies.accessToken as string);
    try {
      const { decoded } = await verifyJwt(
        accesstoken,
        'ACCESS_TOKEN_PUBLIC_KEY'
      );

      if (decoded) {
        await updateSession({ id: decoded.session }, { valid: false });

        const cookies = new Cookies(req, res);
        cookies.set('accessToken', '', {
          maxAge: 0,
          httpOnly: true,
          domain: 'localhost',
          path: '/',
          sameSite: 'strict',
          secure: false,
        });
        res.setHeader('x-access-token', '');
        return res.status(200).json({ accesstoken: null, refreshtoken: null });
      }
      return res.status(401).json({ error: 'Unauthorized' });
    } catch (error: any) {
      throw new Error(error);
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
