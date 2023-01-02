# Bootstrapping Next-Todo

First, clone the repo, cd into the repo and download the dependancies:

```bash
cd Next-Todo-ts

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

Rename the `.env-example`

```
.env-example => .env
```

## Environment Variables

❗ For signing JWTs, asymmetric public SPKI and private PKCS#8 encoded RSA keys will be needed. This [link](https://stackoverflow.com/a/44474607/17552327) describes how to generate such keys through the OpenSSL library. Before adding your keys to the appropriate environment variables **_please ensure that you base64 encode your keys, [here](https://www.base64encode.org/) is a handy site that will do so for you_**.❗

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Next-Todo Authorization API Token Flow

![Authorization Token Flow](/public/refresh-token-flow.png)

## Upon Authentication (via Next-Todo or an OAuth provider), Users will be granted API access and refresh tokens in the form of a JWT.

# OAuth 2.0 OpenID Connect Authorization Code Flow

![OAuth OpenID](https://miro.medium.com/max/720/0*bPC5YzMETbF81R4E.webp)
