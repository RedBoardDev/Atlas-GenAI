import {
  DynamoDBDocumentClient,
  PutCommand,
  BatchWriteCommand,
  UpdateCommand,
  QueryCommand,
  QueryCommandOutput,
  QueryCommandInput,
  GetCommand,
  DeleteCommand,
  PutCommandInput,
  PutCommandOutput,
  BatchWriteCommandInput,
  BatchWriteCommandOutput,
  UpdateCommandInput,
  UpdateCommandOutput,
  GetCommandInput,
  GetCommandOutput,
  DeleteCommandInput,
  DeleteCommandOutput,
} from "@aws-sdk/lib-dynamodb";
import {
  DynamoDBClient,
  UpdateItemCommand,
  UpdateItemCommandInput,
  UpdateItemCommandOutput,
} from "@aws-sdk/client-dynamodb";

const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
};

let dbParams: {
  region: string;
  credentials: { accessKeyId: string; secretAccessKey: string };
  endpoint?: string;
} = {
  region: process.env.AWS_DEFAULT_REGION as string,
  credentials,
};

if (process.env.STAGE === "dev") {
  dbParams = {
    region: process.env.AWS_DEFAULT_REGION as string,
    endpoint: "http://localstack:4566",
    credentials,
  };
} else {
  dbParams = { region: process.env.AWS_DEFAULT_REGION as string, credentials };
}

const client = new DynamoDBClient(dbParams);
const docClient = DynamoDBDocumentClient.from(client, {marshallOptions: { removeUndefinedValues: true },});

class DynamoService {
  create = async (params: PutCommandInput): Promise<PutCommandOutput> => {
    try {
      return await docClient.send(new PutCommand(params));
    } catch (error) {
      throw new Error(`create-error: ${error}`);
    }
  };

  batchWrite = async (
    params: BatchWriteCommandInput
  ): Promise<BatchWriteCommandOutput> => {
    try {
      return await docClient.send(new BatchWriteCommand(params));
    } catch (error) {
      throw new Error(`batch-create-error: ${error}`);
    }
  };

  update = async (
    params: UpdateCommandInput
  ): Promise<UpdateCommandOutput> => {
    try {
      return await docClient.send(new UpdateCommand(params));
    } catch (error) {
      throw new Error(`update-error: ${error}`);
    }
  };

  updateItem = async (
    params: UpdateItemCommandInput
  ): Promise<UpdateItemCommandOutput> => {
    try {
      return await docClient.send(new UpdateItemCommand(params));
    } catch (error) {
      throw new Error(`update-error: ${error}`);
    }
  };

  query = async (params: QueryCommandInput): Promise<QueryCommandOutput> => {
    try {
      return await docClient.send(new QueryCommand(params));
    } catch (error) {
      throw new Error(`query-error: ${error}`);
    }
  };

  get = async (params: GetCommandInput): Promise<GetCommandOutput> => {
    try {
      return await docClient.send(new GetCommand(params));
    } catch (error) {
      throw new Error(`get-error: ${error}`);
    }
  };

  delete = async (
    params: DeleteCommandInput
  ): Promise<DeleteCommandOutput> => {
    try {
      return await docClient.send(new DeleteCommand(params));
    } catch (error) {
      throw new Error(`delete-error: ${error}`);
    }
  };
}

export default new DynamoService();