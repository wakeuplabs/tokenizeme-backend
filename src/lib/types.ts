import * as jwt from "jsonwebtoken";

export interface WU_JwtPayload extends jwt.JwtPayload {
  email: string;
}
