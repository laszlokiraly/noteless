## build deploy
```
$ npm install -g serverless
$ cd ./serverless
$ serverless deploy

Serverless: Packaging service...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service .zip file to S3 (4.25 KB)...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
.....................................................................
Serverless: Stack update finished...
Service Information
service: Noteless
stage: dev
region: us-east-1
api keys:
  None
endpoints:
  GET - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod/v1/notes
  POST - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod/v1/notes
  PUT - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod/v1/notes
functions:
  getNotes: NotelessV1-prod-getNotes
  postNote: NotelessV1-prod-postNote
  deleteNote: NotelessV1-prod-deleteNote
finished in 88.689s                

$ deploy-hosting.sh
...
upload: ....      
```

## iam, cognito, openid, federated identity
http://docs.aws.amazon.com/cognito/latest/developerguide/authentication-flow.html
http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-browser-credentials-cognito.html
https://web-identity-federation-playground.s3.amazonaws.com/index.html
(http://docs.aws.amazon.com/cognitoidentity/latest/APIReference/Welcome.html)
https://aws.amazon.com/blogs/developer/authentication-with-amazon-cognito-in-the-browser/
http://docs.aws.amazon.com/cognito/latest/developerguide/google.html#JavaScript

## ssl:
https://docs.aws.amazon.com/apigateway/latest/developerguide/getting-started-client-side-ssl-authentication.html

## intro:
  - flow http://docs.aws.amazon.com/cognito/latest/developerguide/authentication-flow.html

## add new identity:
  - Noteless/AwsUtil: add IDENTITY_PROVIDER.LOGINS (http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityCredentials.html)
  - AWS https://console.aws.amazon.com/cognito/pool/edit/?region=us-east-1&id=us-east-1:xxxxxxxxxx add authentication provider key and secret

- http://docs.aws.amazon.com/cognito/latest/developerguide/twitter.html#set-up-twitter-1.javascript (quite empty)
- https://dev.twitter.com/web/sign-in/desktop-browser
- https://forums.aws.amazon.com/ann.jspa?annID=4482
- https://github.com/awslabs/aws-serverless-auth-reference-app/blob/master/api/lambda/authorizer.js
- https://www.youtube.com/watch?v=n4hsWVXCuVI&list=PLhr1KZpdzukdAg4bXtTfICuFeZFC_H2Xq&index=6
- http://docs.aws.amazon.com/cognitoidentity/latest/APIReference/API_ListIdentities.html

[...] there is no additional cost for using groups within a user pool. You pay only for Monthly Active Users (MAUs) after the free tier. Also remember that using the Cognito Federated Identities feature for controlling user permissions and generating unique identifiers is always free with Amazon Cognito. (https://aws.amazon.com/blogs/aws/new-amazon-cognito-groups-and-fine-grained-role-based-access-control-2/)

## bingo

confused deputy, never thrust a client
