const doc = require("dynamodb-doc");
const dynamo = new doc.DynamoDB();
const version = "v7";

/*
* Notes notes
*/
module.exports.getNotes = (event, context, callback) => {

  const response = (err, res) => callback(null, {
    statusCode: err ? "400" : "200",
    body: err ? err.message : JSON.stringify(res),
    headers: {
      "Content-Type": "application/json"
    }
  });

  const params = {
    TableName: `Notes-${version}`,
    KeyConditionExpression: "#userid = :userid",
    ProjectionExpression: "content, clientUuid, createdTimestamp, updatedTimestamp, serverlessUuid, title",
    ExpressionAttributeNames: {
      "#userid": "userid"
    },
    ExpressionAttributeValues: {
      ":userid": event.identity.cognitoIdentityId
    }
  };

  dynamo.query(params, response);
};

/*
* Notes notes
*/
module.exports.saveOrUpdateNote = (event, context, callback) => {

  // http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
  const guid = () => {
    const s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    };
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
  };

  const done = (err, res) => callback(null, {
    statusCode: err ? "400" : "200",
    body: err ?
      err.message
      : { // omit content, since it is unchanged
        clientUuid: event.body.clientUuid,
        serverlessUuid: event.body.serverlessUuid,
        createdTimestamp: event.body.createdTimestamp,
        updatedTimestamp: event.body.updatedTimestamp,
        title: event.body.title
        // omit userid, since it does not need to be exposed
      },
    headers: {
      "Content-Type": "application/json"
    }
  });

  // wtf https://github.com/aws/aws-sdk-js/issues/833
  if (event.body.title === "") {
    delete event.body.title;
  }
  if (event.body.content === "") {
    delete event.body.content;
  }

  event.body.userid = event.identity.cognitoIdentityId;

  switch (event.method) {
    case "POST":
      if (!event.body.createdTimestamp) {
        event.body.createdTimestamp = new Date().toJSON();
        event.body.updatedTimestamp = event.body.createdTimestamp;
        event.body.serverlessUuid = guid();
        dynamo.putItem({
          TableName: `Notes-${version}`,
          Item: event.body
        }, done);
      } else {
        event.body.updatedTimestamp = new Date().toJSON();
        dynamo.putItem({
          TableName: `Notes-${version}`,
          Item: event.body
        }, done);
      }
      break;
    default:
      done(new Error(`Unsupported method "${event.method}!"`));
      break;
  }
};

/*
* Notes notes
*/
module.exports.deleteNote = (event, context, callback) => {

  const response = (err) => callback(null, {
    statusCode: err
      ? "400"
      : "200",
    body: err
      ? err.message
      : {},
    headers: {
      "Content-Type": "application/json"
    }
  });

  dynamo.deleteItem({
    TableName: `Notes-${version}`,
    Key: {
      userid: event.identity.cognitoIdentityId,
      clientUuid: event.body.clientUuid
    }
  }, response);

};
