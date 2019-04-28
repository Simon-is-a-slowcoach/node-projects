import { Document } from "mongoose";
import { IUserDocument } from "./IUserDocument";
import { ITopicDocument } from "./ITopicDocument";

export interface ICommentDocument extends Document {
    id: number;
    content: string;
    author: IUserDocument;
    underTopic: ITopicDocument;
    replyTo: ICommentDocument;
    replied: boolean;
    createdAt: Date;
}
