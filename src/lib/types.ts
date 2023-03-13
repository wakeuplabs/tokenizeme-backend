import * as jwt from "jsonwebtoken";

export interface WU_JwtPayload extends jwt.JwtPayload {
  email: string;
}

export enum ProductStatus  {
  listed = 'listed',
  onSale = 'onSale',
  sold = 'sold',
  cancelled = 'cancelled'
}