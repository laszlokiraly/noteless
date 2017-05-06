import APPCONFIG from "./config.json";
import AWS from "aws-sdk";
import apigClientFactory from "aws-api-gateway-client";

export default class AwsNotesApi {

  post(note) {
    const apigClient = apigClientFactory.newClient({
      accessKey: AWS.config.credentials.accessKeyId,
      secretKey: AWS.config.credentials.secretAccessKey,
      sessionToken: AWS.config.credentials.sessionToken,
      region: APPCONFIG.AWS.REGION,
      invokeUrl: APPCONFIG.AWS.FUNCTIONS.INVOKE_URL
    });
    return apigClient.invokeApi({}, "", "POST", {}, note);
  }

  delete(note) {
    const apigClient = apigClientFactory.newClient({
      accessKey: AWS.config.credentials.accessKeyId,
      secretKey: AWS.config.credentials.secretAccessKey,
      sessionToken: AWS.config.credentials.sessionToken,
      region: APPCONFIG.AWS.REGION,
      invokeUrl: APPCONFIG.AWS.FUNCTIONS.INVOKE_URL
    });
    delete note.content;
    return apigClient.invokeApi({}, "", "DELETE", {}, note);
  }

  getAll() {
    return new Promise((resolve, reject) => {
      apigClientFactory.newClient({
        accessKey: AWS.config.credentials.accessKeyId,
        secretKey: AWS.config.credentials.secretAccessKey,
        sessionToken: AWS.config.credentials.sessionToken,
        region: APPCONFIG.AWS.REGION,
        invokeUrl: APPCONFIG.AWS.FUNCTIONS.INVOKE_URL })
      .invokeApi({}, "", "GET", {}, {})
      .then((response) => {
        const status = response.data.statusCode || "200";
        if (status === "200") {
          resolve(JSON.parse(response.data.body).Items);
        } else if (status === "400") {
          // no notes yet
          resolve([]);
        } else {
          reject(response.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
    });
  }

}
