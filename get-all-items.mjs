import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.SAMPLE_TABLE;

export const getAllItemsHandler = async (event) => {
    try {
        console.info("Fetching all incidents from DynamoDB...");
        
        const data = await ddbDocClient.send(new ScanCommand({ TableName: tableName }));
        const items = data.Items || [];

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",  // ✅ Enable CORS
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, X-Api-Key, Authorization"
            },
            body: JSON.stringify(items),
        };
    } catch (error) {
        console.error("Error fetching incidents:", error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",  // ✅ Ensure CORS headers on error
                "Access-Control-Allow-Methods": "OPTIONS,GET",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: JSON.stringify({ error: "Internal Server Error" }),
        };
    }
};




