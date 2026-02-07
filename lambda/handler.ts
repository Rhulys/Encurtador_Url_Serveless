import { APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand} from "@aws-sdk/lib-dynamodb"
import { nanoid } from 'nanoid'

const client = new DynamoDBClient({
    endpoint: "http://localhost.localstack.cloud:4566",
    region: "us-east-1"
})

const ddbDocClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME || '';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const method = event.httpMethod;

    try {

        if (method === 'POST') {
            const body = JSON.parse(event.body || '{}')
            const originalUrl = body.url;

            if (!originalUrl) {
                return { statusCode: 400, body: JSON.stringify({  error: 'URL é obrigatória'})}
            }

            const shortCode = nanoid(6)

            await ddbDocClient.send(new PutCommand({
                TableName: TABLE_NAME,
                Item: { shortCode, originalUrl }
            }))

            return {
                statusCode: 201,
                body: JSON.stringify({ shortUrl: `http://localhost:4566/prod/${shortCode}`})
            }
        }

        const path = event.path;

        if (method === 'GET' && path.includes('stats/')) {
            const parts = path.split('/');
            const shortCode = parts[parts.length - 1];

            const result = await ddbDocClient.send(new GetCommand({
                TableName: TABLE_NAME,
                Key: { shortCode }
            }))

            if (!result.Item) {
                return { statusCode: 404, body: JSON.stringify({ error: "Não encontrado"})}
            }

            return {
                statusCode: 200,
                body: JSON.stringify({
                    shortCode: result.Item.shortCode,
                    originalUrl: result.Item.originalUrl,
                    cliques: result.Item.hits || 0
                })
            }
        }

        const shortCode = event.pathParameters?.proxy;

        if (shortCode) {
            const result = await ddbDocClient.send(new UpdateCommand({
                TableName: TABLE_NAME,
                Key: { shortCode },
                UpdateExpression: "SET hits = if_not_exists(hits, :zero) + :inc",
                ExpressionAttributeValues: {
                    ":zero": 0,
                    ":inc": 1,
                },
                ReturnValues: "ALL_NEW",
            }));

            if ( result.Attributes) {

                return {
                    statusCode: 301,
                    headers: { Location: result.Attributes.originalUrl },
                    body: ''
                }
            }
        }

        return { statusCode: 404, body: JSON.stringify({ message: "Não encontrado "})}
    } catch (error: any) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message})}
    }
}