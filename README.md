📜 README: AI-Powered IT Incident Response System
🚀 Project Overview

This AI-powered IT Incident Response System automatically classifies IT incidents using Claude v2 on Amazon Bedrock, stores them in AWS DynamoDB, and provides a React.js dashboard to visualize incident severity levels.

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




🚀 Setup & Deployment
1️⃣ Clone the Repository

git clone https://github.com/YOUR_USERNAME/ai-incident-response.git
cd ai-incident-response

2️⃣ Deploy the Backend (AWS Lambda)

✅ Ensure you have AWS CLI & AWS SAM installed.
Deploy using AWS SAM:

cd backend
sam build && sam deploy

🔹 This will deploy API Gateway, Lambda, DynamoDB, and Bedrock integration.

3️⃣ Run the Frontend (React.js Dashboard)

cd frontend
npm install
npm start

🔹 This starts a local React.js server where you can submit & view incidents.
🛠️ How It Works

1️⃣ User submits an IT incident via the React.js UI.
2️⃣ API Gateway forwards it to AWS Lambda.
3️⃣ Lambda calls Claude v2 (Amazon Bedrock) to classify severity.
4️⃣ Incident is stored in DynamoDB with AI-generated classification.
5️⃣ Frontend fetches data to visualize classified incidents.
📊 Live Demo & API Access

    🔗 Deployed Frontend: [Your Amplify/Vercel URL]
    🔗 API Gateway URL: [Your API Endpoint]

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

