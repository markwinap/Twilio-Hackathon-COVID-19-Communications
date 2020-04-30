# Twilio-Hackathon-COVID-19-Communications

## LAMBDA

covid19-rds-service

## RDS

NAME: covid19
Engine: Aurora (MySQL) Serverless

### Patient TABLE SCHEDMA

```sql
CREATE TABLE patient (
patientId INT AUTO_INCREMENT PRIMARY KEY,
firstName VARCHAR(30) DEFAULT '',
lastName VARCHAR(30) DEFAULT '',
ssn VARCHAR(9) DEFAULT '',
bed VARCHAR(20) DEFAULT '',
age TINYINT DEFAULT 1,
sex TINYINT DEFAULT 1,
status TINYINT DEFAULT 1,
createdDate DATE,
updatedDate DATE,
admissionDate DATE ,
exitDate DATE
);
```

### Patient TABLE SCHEDMA

```sql
CREATE TABLE familly (
famillyId INT AUTO_INCREMENT PRIMARY KEY,
firstName VARCHAR(30) DEFAULT '',
lastName VARCHAR(30)  DEFAULT '',
relationship TINYINT  DEFAULT 1,
email VARCHAR(40),
mobile VARCHAR(40),
createdDate DATE,
updatedDate DATE,
patientId INT DEFAULT 1
);
```

### PatientNotes TABLE SCHEDMA

```sql
CREATE TABLE notes (
noteId INT AUTO_INCREMENT PRIMARY KEY,
createdDate DATE,
updatedDate DATE,
patientId INT DEFAULT 1,
public TINYINT(1) DEFAULT 0,
note TEXT
);
```

## API GATEWAY

### INSERT RECORD

```sh
curl --location --request POST 'https://host/DEV/aurora' \
--header 'Content-Type: application/json' \
--data-raw ' {
    "sql":
      "INSERT INTO patient (firstName,lastName,ssn,bed,age,sex,status,createdDate,updatedDate,admissionDate,exitDate) values (:firstName,:lastName,:ssn,:bed,:age,:sex,:status,:createdDate,:updatedDate,:admissionDate,:exitDate)",
    "parameters": [
      { "name": "firstName", "value": { "stringValue": "juan" } },
      { "name": "lastName", "value": { "stringValue": "perez" } },
      { "name": "ssn", "value": { "stringValue": "123456789" } },
      { "name": "bed", "value": { "stringValue": "abc12" } },
      { "name": "age", "value": { "longValue": 1 } },
      { "name": "sex", "value": { "longValue": 1 } },
      { "name": "status", "value": { "longValue": 1 } },
      { "name": "createdDate", "value": { "stringValue": "2020-04-29" } },
      { "name": "updatedDate", "value": { "stringValue": "2020-04-29" } },
      { "name": "admissionDate", "value": { "stringValue": "2020-04-29" } },
      { "name": "exitDate", "value": { "stringValue": "2020-04-29" } }
    ]
}'
```

### SELECT RECORDS

```sh
curl --location --request POST 'https://host/DEV/aurora' \
--header 'Content-Type: application/json' \
--data-raw ' {
    "sql": "SELECT * FROM patient LIMIT 1",
    "parameters": []
}'
```

### UPDATE RECORD

```sh
curl --location --request POST 'https://host/DEV/aurora' \
--header 'Content-Type: application/json' \
--data-raw ' {
    "sql": "UPDATE patient SET firstName=:firstName,lastName=:lastName,ssn=:ssn,bed=:bed,age=:age,sex=:sex,status=:status,updatedDate=:updatedDate WHERE patientId = :patientId",
    "parameters": [
    	{ "name": "patientId", "value": { "longValue": 1 } },
      { "name": "firstName", "value": { "stringValue": "Juan" } },
      { "name": "lastName", "value": { "stringValue": "Perez" } },
      { "name": "ssn", "value": { "stringValue": "987654321" } },
      { "name": "bed", "value": { "stringValue": "abc12" } },
      { "name": "age", "value": { "longValue": 30 } },
      { "name": "sex", "value": { "longValue": 1 } },
      { "name": "status", "value": { "longValue": 20 } },
      { "name": "updatedDate", "value": { "stringValue": "2020-04-30" } }
    ]
}'
```

## Cognito

### Identity Pool

Id:
us-west-2:a2eb48fc-6f49-49a1-b111-fd3482f80043
ARN
arn:aws:cognito-identity:us-west-2:843132870052:identitypool/us-west-2:a2eb48fc-6f49-49a1-b111-fd3482f80043

### User Pool

Id:
us-west-2_suNGk8GOZ
ARN:
arn:aws:cognito-idp:us-west-2:843132870052:userpool/us-west-2_suNGk8GOZ

App Clients
WebClient
App Id:
5u2cgop5aghadug1do59rp8s5o
AppClient
App Id:
7pqjad5dlqbiqnfp7aqqdluork
