import { MongoClient, ObjectId } from "mongodb";
import { id, index, Repository } from "mongodb-typescript";

class Customer {
  @id id!: ObjectId;

  name: string;

  @index(1, { unique: true }) email: string;

  wallet: string;

  constructor(name: string, email: string, wallet: string) {
    this.name = name;
    this.email = email;
    this.wallet = wallet;
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


const bootstrapDatabase = async (mongodbClient: MongoClient) => {
  const customerRepository = await getCustomerRepository(mongodbClient);

  let firstWallet = await customerRepository.findOne();
  console.log("Demo Wallet:", firstWallet?.wallet);
};

export {
  Customer,
  getCustomerRepository,
  bootstrapDatabase,
};
