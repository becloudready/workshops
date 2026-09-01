# Training Plan and Assignment Backend

## Project Information

- Team: GeekyChads
- Application: NoticeBoardTracker
- Backend: Java and Spring Boot
- Database: MongoDB Atlas
- Developer section: Training Plans and Assignments

## Purpose

This backend section manages training plans and assignments. Training plans contain assignment ID references, allowing assignments to be created independently and connected to one or more plans.

## Models

### Training Plan

```json
{
  "planId": "MongoDB-generated ID",
  "planName": "Backend Development Training",
  "assignments": [
    "MongoDB-generated Assignment ID"
  ],
  "status": "INCOMPLETE"
}
```

### Assignment

```json
{
  "assignmentId": "MongoDB-generated ID",
  "assignmentName": "Build a Spring Boot API",
  "numberOfSteps": 5,
  "status": "INCOMPLETE"
}
```

## Training Plan Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/training-plans` | Create a training plan |
| GET | `/training-plans` | Get all training plans |
| GET | `/training-plans/{planId}` | Get one training plan |
| PUT | `/training-plans/{planId}` | Update a training plan |
| DELETE | `/training-plans/{planId}` | Delete a training plan |
| GET | `/training-plans/{planId}/assignments` | Get assignment IDs connected to a plan |
| POST | `/training-plans/{planId}/assignments` | Attach an Assignment ID to a plan |
| DELETE | `/training-plans/{planId}/assignments/{assignmentId}` | Detach an Assignment from a plan |

## Assignment Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/assignments` | Create an Assignment |
| GET | `/assignments` | Get all Assignments |
| GET | `/assignments/{assignmentId}` | Get one Assignment |
| PUT | `/assignments/{assignmentId}` | Update an Assignment |
| DELETE | `/assignments/{assignmentId}` | Delete an Assignment |

## Creating and Connecting Records

### 1. Create an Assignment

```http
POST /assignments
```

```json
{
  "assignmentName": "Build a Spring Boot API",
  "numberOfSteps": 5,
  "status": "INCOMPLETE"
}
```

MongoDB generates the `assignmentId`.

### 2. Create a Training Plan

```http
POST /training-plans
```

```json
{
  "planName": "Backend Development Training",
  "assignments": [],
  "status": "INCOMPLETE"
}
```

MongoDB generates the `planId`.

### 3. Connect the Assignment to the Plan

```http
POST /training-plans/{planId}/assignments
```

```json
{
  "assignmentId": "generated-assignment-id"
}
```

The frontend displays Assignment names while using IDs internally.

## MongoDB Configuration

`application.properties`:

```properties
spring.application.name=noticeboardtracker
spring.mongodb.uri=${MONGODB_URI}
```

Set the MongoDB connection string in PowerShell:

```powershell
$env:MONGODB_URI="YOUR_MONGODB_CONNECTION_STRING"
```

Credentials are not committed to Git.

## Running the Application

```powershell
.\mvnw.cmd spring-boot:run
```

The API runs at:

```text
http://localhost:8080
```

## Running Tests

```powershell
.\mvnw.cmd test
```

The project contains 11 passing tests covering Training Plan and Assignment service operations.

## Testing Tools

The endpoints were manually tested using Postman and connected successfully to MongoDB Atlas.