import { Document } from "mongoose";
import { IUserDocument } from "./IUserDocument";

export interface ITopicDocument extends Document {
    id: number;
    title: string;
    content: string;
    author: IUserDocument;
    createdAt: Date;
}
