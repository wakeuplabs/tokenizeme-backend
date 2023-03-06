import { Request, Response, NextFunction } from "express";

import mongodbClient from "../lib/db/client";
import { Customer, getCustomerRepository } from "../lib/db/entities";

import { object, string } from "yup";
import { v4 as uuidv4 } from "uuid";

const customerSchema = object().shape({
  name: string().required(),
  email: string().required(),
  wallet: string().required(),
});

const getCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.query;

    if (!email) {
      throw new Error(`Missing email filter`);
    }

    const repository = await getCustomerRepository(mongodbClient);

    const registeredApiKey = await repository.findOne({ email });

    return res.status(200).json(registeredApiKey);
  } catch (error) {
    return next(error);
  }
};

const createCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, wallet } = await customerSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const repository = await getCustomerRepository(mongodbClient);
    const registeredCustomer = await repository.findOne({ email });
    const newCustomer = new Customer(name, email, wallet);
    if(!registeredCustomer){
      await repository.insert(newCustomer);  
    }else{
      registeredCustomer.wallet = wallet;
      await repository.save(registeredCustomer);
    }
    return res.status(200).json(newCustomer);
  } catch (error) {
    return next(error);
  }
};

export default {
  getCustomer,
  createCustomer,
};
