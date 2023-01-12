import { createMocks, RequestMethod } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';
import createUserHandler from '@/pages/api/user/create';
import { createRequest, createResponse } from 'node-mocks-http';

type ApiRequest = NextApiRequest & ReturnType<typeof createRequest>;
type ApiResponse = NextApiResponse & ReturnType<typeof createResponse>;

jest.useRealTimers();

describe('/api/user/create API Endpoint', () => {
  //   const authToken = process.env.AUTH_TOKEN;
  //   const gatewayID = process.env.DEVICE_ID;

  //   export interface UserInput {
  //     firstName: string;
  //     lastName: string;
  //     email: string;
  //     password: string;
  //   }

  function mockRequestResponse(method: RequestMethod = 'POST') {
    const { req, res }: { req: ApiRequest; res: ApiResponse } = createMocks({
      method,
    });
    req.headers = {
      'Content-Type': 'application/json',
    };
    req.body = {
      firstName: 'stan',
      lastName: 'lee',
      email: 'stanlee@email.com',
      password: 'password',
      passwordConfirmation: 'password',
    };

    return { req, res };
  }

  it('should should return a new user', async () => {
    const { req, res } = mockRequestResponse();
    jest.setTimeout(10 * 1000);
    await createUserHandler(req, res);

    expect(res.statusCode).toBe(201);
    expect(res.getHeaders()).toEqual({ 'content-type': 'application/json' });
  }, 10000);
});
