import { Request, Response, NextFunction } from "express";

import mongodbClient from "../lib/db/client";
import { Customer, getCustomerRepository } from "../lib/db/entities";

import { object, string } from "yup";
import { v4 as uuidv4 } from "uuid";

const customerSchema = object().shape({
  name: string().required(),
  email: string().required(),
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
    const { name, email } = await customerSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const repository = await getCustomerRepository(mongodbClient);

    const apiKey = uuidv4();
    const newCustomer = new Customer(name, email, apiKey);
    await repository.insert(newCustomer);

    return res.status(200).json(newCustomer);
  } catch (error) {
    return next(error);
  }
};

export default {
  getCustomer,
  createCustomer,
};
