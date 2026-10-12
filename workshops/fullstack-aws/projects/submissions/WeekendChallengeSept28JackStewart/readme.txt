# Notice Board Application

## Architecture

Frontend:
Amazon S3 Static Website Hosting

Backend:
Amazon API Gateway HTTP API
AWS Lambda (Python)
MongoDB Atlas

## API Routes

GET /notices
POST /notices
GET /notices/{id}
PUT /notices/{id}
DELETE /notices/{id}

## Deployment

Frontend:
http://noticeboard-jackstewart.s3-website-us-east-1.amazonaws.com

Backend:
https://neindm9svd.execute-api.us-east-1.amazonaws.com/notices