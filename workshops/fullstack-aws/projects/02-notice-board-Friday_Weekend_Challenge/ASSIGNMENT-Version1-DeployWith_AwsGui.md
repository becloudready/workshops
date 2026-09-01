This guide provides a step-by-step tutorial for your students to deploy a full-stack **Notice Board Application** using the AWS Web GUI

---

### Architecture Overview

```
 [ Client Browser ]
        |
        v
 [ Amazon S3 Static Website ]
        |
        | (REST API Calls via HTTPS)
        v
 [ Amazon API Gateway (HTTP API) ]
        |
        v
 [ AWS Lambda (Python Backend) ]
        |
        v
 [ MongoDB Atlas (Cloud Database) ]

```

---

### Step 1: Set Up MongoDB Atlas (Database)

1. Sign up/log in at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. **Create a Cluster:** Choose the **M0 Free Tier** cluster, pick AWS as the provider, and launch it.
3. **Set Up Database Security:**
* Under **Database Access**, create a user (e.g., `admin`) and set a strong password. Save these credentials.
* Under **Network Access**, click **Add IP Address** $\rightarrow$ select **Allow Access from Anywhere** (`0.0.0.0/0`) so AWS Lambda can connect.


4. **Get Connection String:**
* Go to **Database** $\rightarrow$ **Connect** $\rightarrow$ **Drivers** (Python).
* Copy the connection URI:
`mongodb+sandbox://admin:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`
* Replace `<password>` with your actual password.



---

### Step 2: Create the AWS Lambda Backend (Python)

1. Open the **AWS Management Console** and search for **Lambda**.
2. Click **Create function**:
* Select **Author from scratch**.
* **Function name:** `NoticeBoardBackend`
* **Runtime:** Select **Python 3.12** (or latest 3.x).
* Click **Create function**.


3. **Add Environment Variables:**
* Go to the **Configuration** tab $\rightarrow$ **Environment variables** $\rightarrow$ **Edit**.
* Add Key: `MONGO_URI`, Value: *Your MongoDB Connection String from Step 1*.
* Save changes.


4. **Add `pymongo` Dependency via Lambda Layer:**
Since Lambda standard runtime does not include `pymongo`, use an AWS-provided layer or upload a zip package:
* Go to the bottom of the **Code** tab $\rightarrow$ **Layers** section $\rightarrow$ **Add a layer**.
* Select **Specify an ARN** and paste an open-source layer ARN matching your region (or upload a `.zip` containing `pymongo` and `bson` installed via `pip install pymongo -t python/`).


5. **Deploy Code:** Replace the default code in `lambda_function.py` with the following:

```python
import json
import os
from bson import ObjectId
from pymongo import MongoClient

# Initialize MongoDB Client outside handler for reusability
client = MongoClient(os.environ["MONGO_URI"])
db = client["noticeboard_db"]
notices_col = db["notices"]


def JSONEncoder(data):
    """Utility to turn MongoDB ObjectIds into strings for JSON response."""
    if isinstance(data, list):
        for item in data:
            item["_id"] = str(item["_id"])
    elif isinstance(data, dict):
        data["_id"] = str(data["_id"])
    return data


def lambda_handler(event, context):
    http_method = event.get("requestContext", {}).get("http", {}).get("method")
    path_parameters = event.get("pathParameters") or {}
    notice_id = path_parameters.get("id")

    # Parse body for POST/PUT requests
    body = {}
    if event.get("body"):
        try:
            body = json.loads(event["body"])
        except Exception:
            pass

    response_body = {}
    status_code = 200

    try:
        # 1. READ ALL (GET /notices)
        if http_method == "GET" and not notice_id:
            notices = list(notices_col.find())
            response_body = JSONEncoder(notices)

        # 2. READ ONE (GET /notices/{id})
        elif http_method == "GET" and notice_id:
            notice = notices_col.find_one({"_id": ObjectId(notice_id)})
            if notice:
                response_body = JSONEncoder(notice)
            else:
                status_code = 404
                response_body = {"error": "Notice not found"}

        # 3. CREATE (POST /notices)
        elif http_method == "POST":
            new_notice = {
                "title": body.get("title", "Untitled"),
                "content": body.get("content", ""),
            }
            result = notices_col.insert_one(new_notice)
            new_notice["_id"] = str(result.inserted_id)
            status_code = 201
            response_body = new_notice

        # 4. UPDATE (PUT /notices/{id})
        elif http_method == "PUT" and notice_id:
            update_data = {}
            if "title" in body:
                update_data["title"] = body["title"]
            if "content" in body:
                update_data["content"] = body["content"]

            notices_col.update_one(
                {"_id": ObjectId(notice_id)}, {"$set": update_data}
            )
            response_body = {"message": "Notice updated successfully"}

        # 5. DELETE (DELETE /notices/{id})
        elif http_method == "DELETE" and notice_id:
            notices_col.delete_one({"_id": ObjectId(notice_id)})
            response_body = {"message": "Notice deleted successfully"}

        else:
            status_code = 400
            response_body = {"error": "Unsupported route"}

    except Exception as e:
        status_code = 500
        response_body = {"error": str(e)}

    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        "body": json.dumps(response_body),
    }

```

6. Click **Deploy**.

---

### Step 3: Create Amazon API Gateway (HTTP API)

1. Search for **API Gateway** in the console.
2. Click **Create API** $\rightarrow$ choose **HTTP API** (cheaper, faster, and easier to set up CORS than REST API).
3. Click **Build**:
* **Integrations:** Select **Lambda**, search and choose `NoticeBoardBackend`.
* **API name:** `NoticeBoardAPI`.
* Click **Next**.


4. **Configure Routes:** Add the following routes mapping to your Lambda integration:
* `GET /notices`
* `GET /notices/{id}`
* `POST /notices`
* `PUT /notices/{id}`
* `DELETE /notices/{id}`
* Click **Next**.


5. Keep default Stage (`$default` with Auto-deploy enabled) $\rightarrow$ Click **Next** $\rightarrow$ **Create**.
6. **Enable CORS:**
* In the left panel, click **CORS**.
* Click **Configure**:
* **Access-Control-Allow-Origin:** `*`
* **Access-Control-Allow-Headers:** `*`
* **Access-Control-Allow-Methods:** `GET, POST, PUT, DELETE, OPTIONS`


* Click **Save**.


7. Copy the **Invoke URL** (e.g., `[https://xyz123.execute-api.us-east-1.amazonaws.com](https://xyz123.execute-api.us-east-1.amazonaws.com)`).

---

### Step 4: React Frontend Setup & Local Build

1. On your local machine, open `App.jsx` in your React project and point API requests to your API Gateway Invoke URL:

```jsx
import React, { useState, useEffect } from 'react';

const API_URL = "https://xyz123.execute-api.us-east-1.amazonaws.com/notices"; // Replace with your URL

export default function App() {
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const fetchNotices = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setNotices(data);
  };

  useEffect(() => { fetchNotices(); }, []);

  const createNotice = async (e) => {
    e.preventDefault();
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content })
    });
    setTitle(''); setContent('');
    fetchNotices();
  };

  const deleteNotice = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchNotices();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Notice Board</h1>
      <form onSubmit={createNotice}>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <br />
        <textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} required />
        <br />
        <button type="submit">Add Notice</button>
      </form>
      <h2>All Notices</h2>
      {notices.map(n => (
        <div key={n._id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
          <h3>{n.title}</h3>
          <p>{n.content}</p>
          <button onClick={() => deleteNotice(n._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

```

2. Build the production output on your computer:
```bash
npm run build

```


*This outputs a folder named `dist` (Vite) or `build` (Create React App).*

---

### Step 5: Host React App on Amazon S3

1. Search for **S3** in the AWS Console.
2. Click **Create bucket**:
* **Bucket Name:** Enter a globally unique name (e.g., `my-noticeboard-student-app-123`).
* **Object Ownership:** ACLs disabled (recommended).
* **Block Public Access settings:** Uncheck **Block *all* public access** (Acknowledge warning checkbox).
* Click **Create bucket**.


3. **Configure Static Website Hosting:**
* Select your bucket $\rightarrow$ **Properties** tab.
* Scroll down to **Static website hosting** $\rightarrow$ Click **Edit**.
* Enable Static Website Hosting.
* **Index document:** `index.html`
* **Error document:** `index.html` (Required for single-page applications).
* Click **Save changes**.


4. **Set Bucket Policy for Public Read:**
* Go to **Permissions** tab $\rightarrow$ **Bucket policy** $\rightarrow$ Click **Edit**.
* Paste the policy below (replace `YOUR-BUCKET-NAME` with your bucket's name):



```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
        }
    ]
}

```

* Click **Save changes**.

5. **Upload Build Files:**
* Go to **Objects** tab $\rightarrow$ Click **Upload**.
* Upload all files and folders **inside** your local `dist`/`build` folder (make sure `index.html` is at the root level of the bucket).
* Click **Upload**.


6. **Access Application:**
* Go to **Properties** tab $\rightarrow$ scroll down to **Static website hosting**.
* Click the **Bucket website endpoint** URL to open the live application in your browser.
