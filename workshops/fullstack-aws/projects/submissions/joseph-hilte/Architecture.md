# Architecture

```
[ Client browser ]
        |
        v
[ Amazon S3 static website ]  -- serves the built React app
        |
        |  HTTPS REST calls (fetch)
        v
[ Amazon API Gateway (HTTP API) ]  -- routes /notices, CORS enabled
        |
        v
[ AWS Lambda (Python 3.12) ]  -- lambda_function.py, CRUD logic
        |
        |  pymongo, MONGO_URI env var
        v
[ MongoDB Atlas (M0 free tier) ]  -- noticeboard_db.notices
```

## Components

**S3** hosts the static files from `npm run build`. Static website hosting is enabled with `index.html` as both the index and error document, and a bucket policy allows public read.

**API Gateway (HTTP API)** exposes five routes, all integrated with one Lambda function. CORS allows `GET, POST, PUT, DELETE, OPTIONS` from any origin.

**Lambda** reads the HTTP method and the optional `{id}` path parameter from the event and performs the matching MongoDB operation. The Mongo client is created outside the handler so warm invocations reuse the connection.

**MongoDB Atlas** stores each notice as a document with `title` and `content`. Network access is open to `0.0.0.0/0` because Lambda has no fixed IP.

## Request flow (create a notice)

1. User submits the form in the React app.
2. Browser sends `POST /notices` with JSON `{ title, content }` to API Gateway.
3. API Gateway invokes Lambda with the request event.
4. Lambda inserts the document into MongoDB and returns `201` with the new notice.
5. The frontend re-fetches `GET /notices` and re-renders the list.
