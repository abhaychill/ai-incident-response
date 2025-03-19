import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.SAMPLE_TABLE;

export const getByIdHandler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, GET",
        "Access-Control-Allow-Headers": "Content-Type, X-Api-Key, Authorization"
      },
      body: JSON.stringify({ error: `Method Not Allowed: ${event.httpMethod} is not supported.` }),
    };
  }

  console.info('Received event:', JSON.stringify(event, null, 2));

  if (!event.pathParameters || !event.pathParameters.id) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, GET",
        "Access-Control-Allow-Headers": "Content-Type, X-Api-Key, Authorization"
      },
      body: JSON.stringify({ error: "Missing 'id' in request path." }),
    };
  }

  const id = event.pathParameters.id;

  try {
    const data = await ddbDocClient.send(new GetCommand({ TableName: tableName, Key: { id } }));
    
    if (!data.Item) {
      return {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS, GET",
          "Access-Control-Allow-Headers": "Content-Type, X-Api-Key, Authorization"
        },
        body: JSON.stringify({ error: "Item not found" }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, GET",
        "Access-Control-Allow-Headers": "Content-Type, X-Api-Key, Authorization"
      },
      body: JSON.stringify(data.Item),
    };
  } catch (err) {
    console.error("DynamoDB Get Error:", err);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, GET",
        "Access-Control-Allow-Headers": "Content-Type, X-Api-Key, Authorization"
      },
      body: JSON.stringify({ error: "Internal Server Error", details: err.message }),
    };
  }
};


