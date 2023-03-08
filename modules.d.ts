import "express";
import { Response } from "express";
import { Customer } from "./src/lib/db/registry";

export declare type ResponseWithLocals = Response & {
  locals: {
    customer?: Customer;
  };
};
