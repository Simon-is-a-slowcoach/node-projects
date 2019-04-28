import { assignIncreasingId } from "./sequence";
import { Schema, Model, model, Types } from "mongoose";
import { ICommentDocument } from "./interfaces/ICommentDocument";

export interface ICommentModel extends Model<ICommentDocument> {
    findByCommentId(id: number): Promise<ICommentDocument>;
}

const CommentSchema = new Schema({
    id: { type: Number, index: { unique: true } },
    content: { type: String, required: true },
    author: { type: Types.ObjectId, ref: "User" , required: true},
    underTopic: { type: Types.ObjectId, ref: "Topic", required: true },
    replyTo: { type: Types.ObjectId, ref: "Comment", default: null, index: true },
    replied: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now, index: true }
});

const modelName = "Comment";

// self increasing id
CommentSchema.pre("save", function(next) {
    const self = this;
    if (self.isNew) {
        assignIncreasingId(modelName, self, "id", next);
    } else {
        next();
    }
});

CommentSchema.statics.findByCommentId = async function(id: number) {
    return this.findOne({ id }).populate([{ path: "author" }, { path: "underTopic" }, { path: "replyTo" }]);
};

CommentSchema.methods.toJSON = function() {
    return {
        id: this.id,
        content: this.content,
        author: this.author.toJSON(),
        underTopicId: this.underTopic.id,
        replyToId: this.replyTo && this.replyTo.id,
        replied: this.replied,
        createdAt: this.createdAt,
    };
};

const Comment: ICommentModel = model<ICommentDocument, ICommentModel>(modelName, CommentSchema);

export default Comment;
