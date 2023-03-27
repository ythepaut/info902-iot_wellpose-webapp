import { MongoClient, ServerApiVersion } from "mongodb";
import getConfig from "next/config";

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

const uri = serverRuntimeConfig.mongodbUri;
if (!uri) {
    throw new Error("Invalid/Missing environment variable: \"MONGODB_URI\"");
}

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
};
let client;
let clientPromise: Promise<MongoClient>;

if (publicRuntimeConfig.environment === "development") {
    let globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
        client = new MongoClient(uri, options);
        globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
} else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export default clientPromise;

export const DB_NAME = "WellPose";
