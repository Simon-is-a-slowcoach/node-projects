import { Document } from "mongoose";

export interface IUserDocument extends Document {
    id: number;
    username: string;
    bio: string;
    avatar: string;
}
