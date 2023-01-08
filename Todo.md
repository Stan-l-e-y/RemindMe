## - Schema folder uses schemas to validate the incoming request,

## with zod <- done by validateRequest helper in lib folder

## body against the schema

## - Services folder which contains services that are called by the routes,

## services are used to handle the business logic and will call the database

## - Utils folder which contains utility functions mainly for JWT

## //TODO: Need to document/update readme in regards to api authorization with JWT and

## update readme to include info on google oauth, add scopes for email and profile

## https://developers.facebook.com/docs/facebook-login/guides/advanced/manual-flow#checklogin, everything at/after Inspecting access tokens will be useful

## for when I need more permissions later from facebook. When I finally need new permissions, im going to have to store the accesstokens in the db.

## right now i only use them as soon as they log in, so theyre accessible right away and i dont need to store them (once i get it i fetch the user profile)
