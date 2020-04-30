'use strict';

const AWS = require('aws-sdk');
const rdsdataservice = new AWS.RDSDataService();
exports.handler = async (event) => {
  console.log(JSON.stringify(event));
  let response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers':
        'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    },
  };
  const body = JSON.parse(event.body);
  const params = {
    resourceArn: process.env.resourceArn,
    secretArn: process.env.secretArn,
    sql: body.sql,
    database: 'covid19',
    parameters: body.parameters,
  };
  const query = await executeStatement(params)
    .then((res) => res)
    .catch((err) => {
      response.statusCode = 500;
      return err;
    });
  response.body = JSON.stringify(query);
  return response;
};
function executeStatement(params) {
  return new Promise((resolve, reject) => {
    rdsdataservice.executeStatement(params, function (err, data) {
      if (err) reject(err);
      else resolve(data);
    });
  });
}
