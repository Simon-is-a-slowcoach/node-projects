import { Document } from "mongoose";

export interface IUserDocument extends Document {
    id: number;
    username: string;
    password: string;
    bio: string;
    avatar: string;
}
