import { MongoClient, ObjectId } from "mongodb";
import { id, index, Repository } from "mongodb-typescript";
import { v4 as uuidv4 } from "uuid";

class Customer {
  @id id!: ObjectId;

  name: string;

  @index(1, { unique: true }) email: string;

  @index(1, { unique: true }) apiKey: string;

  constructor(name: string, email: string, apiKey: string) {
    this.name = name;
    this.email = email;
    this.apiKey = apiKey;
  }
}

enum Method {
  POST = "POST",
  GET = "GET",
  DELETE = "DELETE",
  PUT = "PUT",
}

class CustomerRegistry {
  @id id: string;

  customerID: ObjectId;

  service: string;

  action: string;

  method: Method;

  yearMonth: string;

  numberOfCalls: number;

  constructor(
    id: string,
    customerID: ObjectId,
    service: string,
    action: string,
    method: Method,
    yearMonth: string
  ) {
    this.id = id;
    this.customerID = customerID;
    this.service = service;
    this.action = action;
    this.method = method;
    this.yearMonth = yearMonth;

    this.numberOfCalls = 1;
  }
}

const getCustomerRepository = async (mongodbClient: MongoClient) => {
  const repository = new Repository<Customer>(
    Customer,
    mongodbClient,
    "customer-entities"
  );

  await repository.createIndexes();

  return repository;
};

const getCustomerRegistryRepository = async (mongodbClient: MongoClient) => {
  const repository = new Repository<CustomerRegistry>(
    CustomerRegistry,
    mongodbClient,
    "customer-registry-entities"
  );

  await repository.createIndexes();

  return repository;
};

const bootstrapDatabase = async (mongodbClient: MongoClient) => {
  const customerRepository = await getCustomerRepository(mongodbClient);

  let firstApiKey = await customerRepository.findOne();

  if (!firstApiKey) {
    const apiKey = uuidv4();
    firstApiKey = new Customer("WakeUp", "chescalante.ar@gmail.com", apiKey);
    await customerRepository.insert(firstApiKey);
  }

  console.log("Demo Api Key:", firstApiKey.apiKey);
};

export {
  Customer,
  CustomerRegistry,
  getCustomerRepository,
  getCustomerRegistryRepository,
  bootstrapDatabase,
};
