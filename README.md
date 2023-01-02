## Bootstrapping Next-Todo

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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

#

## Next-Todo Authorization API Token Flow

![Authorization Token Flow](/public/refresh-token-flow.png)

## Upon Authentication (via Next-Todo or an OAuth provider), Users will be granted an API access and refresh token in the form of a JWT.

## OAuth 2.0 OpenID Connect Authorization Code Flow

![OAuth OpenID](https://miro.medium.com/max/720/0*bPC5YzMETbF81R4E.webp)
