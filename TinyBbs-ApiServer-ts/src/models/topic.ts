import { assignIncreasingId } from "./sequence";
import { Schema, Model, model, Types } from "mongoose";
import { ITopicDocument } from "./interfaces/ITopicDocument";

export interface ITopicModel extends Model<ITopicDocument> {
    findByTopicId(id: number): Promise<ITopicDocument>;
}

const TopicSchema = new Schema({
    id: { type: Number, index: { unique: true } },
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now, index: true }
});

const modelName = "Topic";

// self increasing id
TopicSchema.pre("save", function(next) {
    const self = this;
    if (self.isNew) {
        assignIncreasingId(modelName, self, "id", next);
        (self as ITopicDocument).createdAt = new Date();
    } else {
        next();
    }
});

TopicSchema.statics.findByTopicId = async function(id: number) {
    return this.findOne({ id }).populate("author");
};

TopicSchema.methods.toJSON = function() {
    return {
        id: this.id,
        title: this.title,
        content: this.content,
        author: this.author.toJSON(),
        createdAt: this.createdAt,
    };
};

const Topic: ITopicModel = model<ITopicDocument, ITopicModel>(modelName, TopicSchema);

export default Topic;
