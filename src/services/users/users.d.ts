import { Document } from "mongoose";
export interface IUsers extends Document {
  email: string;
  username: string;
  password: string;
}
