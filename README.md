# Bootstrapping RemindMe

### First:

1. Clone the repo
2. `cd` into the repo
3. Install the dependancies

```bash
cd RemindMe

npm install
# or
yarn add
```

### Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

### Rename the `.env.example`

```
.env.example => .env
```

## Environment Variables

In order to generate access and refresh token (by signing JWTs), asymmetric public SPKI and private PKCS#8 encoded RSA keys will be needed. [This](https://stackoverflow.com/a/44474607/17552327) link describes how to generate such keys through the OpenSSL library.

❗To retain formatting, before adding your keys to the appropriate environment variables **_please ensure that you base64 encode them._** [Here](https://www.base64encode.org/) is a handy site that will encode them for you.❗

### Facebook credentials

To allow users signing into our application via Facebook we must follow the OAuth 2.0 protocol and use the Facebook Graph API to authenticate our users.

- Follow the guide [here](https://developers.facebook.com/docs/facebook-login/web) to register you application with Facebook.
- Enable and configure Facebook Login through the developer dashboard.

By default, Facebook has the `email` and `public_profile` permissions/scopes enabled which are the only two our app requires.

### Google credentials

To allow users signing into our application via Google we must follow the OAuth 2.0 protocol in order to use Google APIs.

Follow [this](https://developers.google.com/identity/protocols/oauth2) guide from Google on how to register your application with them.

Once registered, navigate to the Google API Console and locate the OAuth consent screen section. The most important part here is selecting the necessary scopes which are as follows:

- `email`
- `profile`
- `openid`

Once your application is registered and configured with both Facebook and Google, you should be able to locate the appropriate environment variables in each sites respected dashboard and fill them into the `.env`

## Database and Prisma Data Proxy

RemindMe user authorization takes place in the `middleware.ts` file. The authorization logic eventually calls the database to see if the session is valid. Since [middleware](https://vercel.com/docs/concepts/functions/edge-middleware) in Next.js is run on the [Edge](https://en.wikipedia.org/wiki/Edge_computing), regular TCP database connnection calls are not valid (the runtime is also not Node.js therefore most packages such as PrismaClient are not available, more on this [here](https://www.prisma.io/blog/database-access-on-the-edge-8F0t1s1BqOJE) and [here](https://github.com/prisma/prisma/issues/9928#issuecomment-970631873)). As a result, we must configure a Proxy to sit between the Edge server and our cloud-based database server.

To get started:

1. Choose a cloud hosted MySQL DB service ([which to choose?](https://www.prisma.io/dataguide/mysql/5-ways-to-host-mysql#managed-services)), then find and copy the connection string.
2. Create a Prisma Data Platform project [here](https://cloud.prisma.io/projects) and use the connection string from the previous step
3. Follow the instructions [here](https://www.prisma.io/docs/data-platform/data-proxy/use-data-proxy) to setup and configure the Prisma Proxy

### Everytime you make changes to your schema you must run these scripts:

```bash
npm run db-push

npm run generate-client
```

The first script [synchronizes](https://www.prisma.io/docs/concepts/components/prisma-migrate/db-push) the `schema.prisma` schema with the database schema. The second script [generates](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/generating-prisma-client) a lightweight version of Prisma Client (query builder) so that we can use it on the Edge server. _Note, the reason as to why there is a script for this and we are not just running the command is because we need to switch the database URL. Currently it points to the proxy but when we want to make changes to the database we need to switch it to the actual database connection URL_

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# RemindMe Authorization API Token Flow

![Authorization Token Flow](/public/refresh-token-flow.png)

Upon Authentication (via RemindMe or an Identity Provider), Users will be granted API Access and Refresh tokens in the form of a JWT. Read more about [Access](https://auth0.com/docs/tokens/concepts/access-tokens) and [Refresh](https://auth0.com/docs/secure/tokens/refresh-tokens) tokens.

# OAuth 2.0 OpenID Connect Authorization Code Flow

![OAuth OpenID](https://miro.medium.com/max/720/0*bPC5YzMETbF81R4E.webp)

Upon Authentication with an Identity Provider, Users will be granted an ID token in the form of a JWT, which will be used for authenticating the user and fetching user information. Read more about [ID tokens](https://auth0.com/docs/tokens/concepts/id-tokens).
