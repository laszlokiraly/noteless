
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
```

iam, cognito, openid, federated identity
http://docs.aws.amazon.com/cognito/latest/developerguide/authentication-flow.html
http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-browser-credentials-cognito.html
https://web-identity-federation-playground.s3.amazonaws.com/index.html
(http://docs.aws.amazon.com/cognitoidentity/latest/APIReference/Welcome.html)
https://aws.amazon.com/blogs/developer/authentication-with-amazon-cognito-in-the-browser/
http://docs.aws.amazon.com/cognito/latest/developerguide/google.html#JavaScript

ssl:
https://docs.aws.amazon.com/apigateway/latest/developerguide/getting-started-client-side-ssl-authentication.html
