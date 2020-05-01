# Twilio-Hackathon-COVID-19-Communications

## Folder Structure

```sh
├───diagrams
├───lambda
│   ├───covid19-rds-service
│   └───covid19-twilio-service
│       └───node_modules
│           ├───axios
│           │   ├───dist
│           │   └───lib
│           │       ├───adapters
│           │       ├───cancel
│           │       ├───core
│           │       └───helpers
│           ├───debug
│           │   └───src
│           ├───follow-redirects
│           └───ms
└───react-portal
    ├───public
    └───src
        ├───components
        │   ├───CardOption
        │   ├───DialogNewFamilly
        │   ├───DialogNewPatientNote
        │   ├───DialogPatient
        │   ├───DialogUpdateFamilly
        │   ├───DialogUpdatePatientNote
        │   ├───FabBack
        │   ├───GridOptions
        │   ├───HeroMessage
        │   ├───PatientTable
        │   ├───RegisterFamily
        │   ├───RegisterPatient
        │   ├───SearchOptions
        │   ├───SnackBarNotification
        │   ├───TableHeadPatient
        │   ├───TabPanel
        │   └───ToolbarTop
        ├───hooks
        │   └───Debounce
        ├───icons
        ├───pages
        │   ├───Main
        │   ├───Patient
        │   └───Register
        └───utils
```

### Local Setup

```sh
git https://github.com/markwinap/Twilio-Hackathon-COVID-19-Communications.git
cd Twilio-Hackathon-COVID-19-Communications\react-portal
```

### Install Portal dependencies

```sh
npm install
```

### Run portal locally

```sh
npm run
```

## LAMBDA

- covid19-rds-service
- covid19-twilio-service

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

### Send Notifications

```sh
curl --location --request POST 'https://w1dms5jz5f.execute-api.us-west-2.amazonaws.com/DEV/twilio' \
--header 'Content-Type: application/json' \
--data-raw '{"familyMembers":[{"famillyId":4,"firstName":"Marco","lastName":"Martinez","relationship":1,"email":"markwinap@gmail.com","mobile":"","createdDate":"2020-05-01","updatedDate":"2020-05-01","patientId":4},{"famillyId":5,"firstName":"oswaldo","lastName":"Martinnez","relationship":1,"email":"","mobile":"","createdDate":"2020-05-01","updatedDate":"2020-05-01","patientId":4},{"famillyId":6,"firstName":"Simple","lastName":"test","relationship":3,"email":"test@test.com","mobile":"+524494382517","createdDate":"2020-05-01","updatedDate":"2020-05-01","patientId":4}],"selectedPatient":{"patientId":4,"firstName":"Chucho","lastName":"Gonzalez","name":"Chucho Gonzalez","ssn":"4561","bed":"TTT3","age":20,"sex":0,"status":1,"createdDate":"2020-04-29","updatedDate":"2020-04-30","admissionDate":"2020-04-29","exitDate":"2020-04-29"},"note":"Patient is feeling a lot better"}'
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
