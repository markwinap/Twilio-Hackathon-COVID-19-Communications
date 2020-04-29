'use strict';

const AWS = require('aws-sdk');
const rdsdataservice = new AWS.RDSDataService();
exports.handler = async (event) => {
  let response = {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
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
    .catch((err) => err);
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
