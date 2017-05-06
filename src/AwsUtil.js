import AWS from "aws-sdk";
import APPCONFIG from "./config.json";
import ConsoleLogger from "./ConsoleLogger";

export default class AwsUtil {

  static resetAWSLogin() {
    // hard reset the Amazon Cognito credentials provider webidentity
    AWS.config = {
      region: APPCONFIG.AWS.REGION
    };
  }

  static bindOpenId(idToken) {

    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: APPCONFIG.AWS.COGNITO.IDENTITY_POOL_ID,
      Logins: {
        "accounts.google.com": idToken
      }
    }, {
      region: APPCONFIG.AWS.REGION,
      httpOptions: {
        timeout: 30000
      }
    });

    const promise = new Promise((resolve, reject) => {
      AWS.config.credentials.get((error) => {
        if (!error) {
          const awsIdentityId = AWS.config.credentials.identityId;
          // https://github.com/rpgreen/serverless-todo/blob/master/app/index.html
          const accessKeyId = AWS.config.credentials.accessKeyId;
          const secretAccessKey = AWS.config.credentials.secretAccessKey;
          const sessionToken = AWS.config.credentials.sessionToken;
          resolve({
            awsIdentityId,
            accessKeyId,
            secretAccessKey,
            sessionToken
          });
        } else {
          ConsoleLogger.error(error);
          reject(error);
        }
      });
    });
    return promise;

  }
}
