// Import required AWS SDK clients
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

// Initialize DynamoDB Client
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

// Initialize Amazon Bedrock Client
const bedrockClient = new BedrockRuntimeClient({ region: "us-east-1" }); // Ensure correct region

// Get the DynamoDB table name from environment variables
const tableName = process.env.SAMPLE_TABLE;

/**
 * Function to classify an incident using Amazon Bedrock AI
 */
async function classifyIncident(description) {
    try {
        const prompt = `
        You are an AI expert in IT incident classification. Based on the incident description below, classify it into one of these categories:
        - CRITICAL: System-wide failures, security breaches, total outages.
        - HIGH: Major disruptions affecting multiple users but not a complete failure.
        - MEDIUM: Functional issues with workarounds available.
        - LOW: Minor issues or routine requests.

        INCIDENT: "${description}"

        Respond with only one word: CRITICAL, HIGH, MEDIUM, or LOW.
        `;

        const response = await bedrockClient.send(
            new InvokeModelCommand({
                modelId: "anthropic.claude-v2:1",  // Use Claude v2 model
                contentType: "application/json",
                accept: "*/*",
                body: JSON.stringify({
                    prompt: `\n\nHuman: ${prompt}\n\nAssistant:`,  // Proper Claude format
                    max_tokens_to_sample: 10,  // Ensures a short response
                    temperature: 0.2,  // Low randomness for consistent classification
                    top_k: 250,
                    top_p: 1,
                    stop_sequences: ["\n\nHuman:"],  // Ensures only one response
                    anthropic_version: "bedrock-2023-05-31"
                }),
            })
        );

        const result = JSON.parse(new TextDecoder().decode(response.body));
        
        // Extract classification from response
        const classification = result?.completion?.trim().toUpperCase() || "Uncategorized";

        // Validate classification output
        const validCategories = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
        return validCategories.includes(classification) ? classification : "Uncategorized";

    } catch (error) {
        console.error("AI Classification Error:", error);
        return "Uncategorized"; // Fallback classification
    }
}

/**
 * Lambda function handler to add an item to DynamoDB
 */
export async function putItemHandler(event) {  // Ensure correct ES Module export
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS, POST",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            body: JSON.stringify({ error: `Method Not Allowed: Expected POST, received ${event.httpMethod}` }),
        };
    }

    console.info("Received event:", JSON.stringify(event, null, 2));

    try {
        const body = JSON.parse(event.body);
        const incident = body.incident;
        const id = new Date().getTime().toString(); // Generate unique ID

        // AI Classification
        const classification = await classifyIncident(incident);

        // Prepare DynamoDB item
        const params = {
            TableName: tableName,
            Item: { id, incident, classification, status: "Open", timestamp: new Date().toISOString() }
        };

        // Store the classified incident in DynamoDB
        await ddbDocClient.send(new PutCommand(params));

        const response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS, POST",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            body: JSON.stringify({ message: "Incident recorded", id, incident, classification }),
        };

        console.info("Response:", response);
        return response;
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS, POST",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            body: JSON.stringify({ error: "Internal Server Error", details: error.message }),
        };
    }
}


