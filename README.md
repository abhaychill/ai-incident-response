# ai-incident-response
🛠️ How It Works  1️⃣ User submits an IT incident via the React.js UI. 2️⃣ API Gateway forwards it to AWS Lambda. 3️⃣ Lambda calls Claude v2 (Amazon Bedrock) to classify severity. 4️⃣ Incident is stored in DynamoDB with AI-generated classification. 5️⃣ Frontend fetches data to visualize classified incidents.
