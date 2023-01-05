# Bootstrapping RemindMe

First:

1. clone the repo
2. cd into the repo
3. install the dependancies

```bash
cd RemindMe

npm install
# or
yarn add
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Rename the `.env.example`

```
.env.example => .env
```

## Environment Variables

In order to generate access and refresh token by signing JWTs, asymmetric public SPKI and private PKCS#8 encoded RSA keys will be needed. [This](https://stackoverflow.com/a/44474607/17552327) link describes how to generate such keys through the OpenSSL library.

❗To retain formatting, before adding your keys to the appropriate environment variables **_please ensure that you base64 encode your keys, [here](https://www.base64encode.org/) is a handy site that will do so for you_**.❗

## Database and Prisma Data Proxy

RemindMe user authorization takes place in the `middleware.ts` file. The authorization logic eventually calls the database to see if the session is valid. Since [middleware](https://vercel.com/docs/concepts/functions/edge-middleware) in Next.js is run on the [Edge](https://en.wikipedia.org/wiki/Edge_computing), regular TCP database connnection calls are not valid (the runtime is also not Node.js therefore most packages such as PrismaClient are not available, more on this [here](https://www.prisma.io/blog/database-access-on-the-edge-8F0t1s1BqOJE) and [here](https://github.com/prisma/prisma/issues/9928#issuecomment-970631873)). As a result, we must configure a Proxy to sit between the Edge server and our cloud-based database server.

To get started:

1. Choose a cloud hosted MySQL DB service ([which to choose?](https://www.prisma.io/dataguide/mysql/5-ways-to-host-mysql#managed-services)), then find and copy the connection string.
2. Create a Prisma Data Platform project [here](https://cloud.prisma.io/projects) and use the connection string from the previous step
3. Follow the instructions [here](https://www.prisma.io/docs/data-platform/data-proxy/use-data-proxy) to setup and configure the Prisma Proxy

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# RemindMe Authorization API Token Flow

![Authorization Token Flow](/public/refresh-token-flow.png)

Upon Authentication (via RemindMe or an Identity Provider), Users will be granted API Access and Refresh tokens in the form of a JWT. Read more about [Access](https://auth0.com/docs/tokens/concepts/access-tokens) and [Refresh](https://auth0.com/docs/secure/tokens/refresh-tokens) tokens.

# OAuth 2.0 OpenID Connect Authorization Code Flow

![OAuth OpenID](https://miro.medium.com/max/720/0*bPC5YzMETbF81R4E.webp)

Upon Authentication with an Identity Provider, Users will be granted an ID token in the form of a JWT, which will be used for authenticating the user and fetching user information. Read more about [ID tokens](https://auth0.com/docs/tokens/concepts/id-tokens).
