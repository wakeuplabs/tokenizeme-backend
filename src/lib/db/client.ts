import { MongoClient } from "mongodb";
import { mongodbUrl } from "../../constants";

const client = new MongoClient(mongodbUrl!);

export default client;
