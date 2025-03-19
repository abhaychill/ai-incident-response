📜 README: AI-Powered IT Incident Response System
🚀 Project Overview

This AI-powered IT Incident Response System automatically classifies IT incidents using Claude v2 on Amazon Bedrock, stores them in AWS DynamoDB, and provides a React.js dashboard to visualize incident severity levels.
The code included in this repo just includes the backend and refrains from posting any code that may contain sensitive data. 

✅ Features:
    🧠 AI-Powered Classification → Uses Claude v2 (Amazon Bedrock) to classify incidents as CRITICAL, HIGH, MEDIUM, or LOW.
    ⚡️ Serverless Backend → AWS Lambda & API Gateway for incident handling.
    🗄️ DynamoDB Storage → Stores all classified incidents.
    📊 Interactive Dashboard → React.js frontend for viewing incidents visually.
    🔑 Secured API Access → API Gateway with an API key.

📦 Tech Stack
Backend:
    AWS Lambda
    Amazon API Gateway
    Amazon Bedrock (Claude v2)
    DynamoDB

Frontend:
    React.js
    Recharts (for visualization)
    Axios (for API calls)




Example API Usage
Submit an Incident (POST)

curl -X POST "https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/Prod/" \
     -H "Content-Type: application/json" \
     -H "x-api-key: YOUR_API_KEY" \
     -d '{ "incident": "Server crash in database cluster" }'

✅ Expected Response:

{
  "message": "Incident recorded",
  "id": "1741500232113",
  "incident": "Server crash in database cluster",
  "classification": "CRITICAL"
}

