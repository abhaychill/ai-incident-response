import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Create the DynamoDB client
const client = new DynamoDBClient({ region: "us-east-1" });  // Change region if needed
const ddbDocClient = DynamoDBDocumentClient.from(client);

export { ddbDocClient };
