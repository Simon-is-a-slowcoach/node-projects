const mongoose = require("mongoose");

const Schema = mongoose.Schema;
// var models = {};

// 存储ID的序列值
SequenceSchema = new Schema({
    _id: { type: String },
    next: { type: Number },
});

SequenceSchema.statics.findAndModify = function(query, sort, doc, options, callback) {
    return this.collection.findAndModify(query, sort, doc, options, callback);
};

SequenceSchema.statics.increment = function(schemaName, callback) {
    return this.collection.findAndModify({ _id: schemaName }, [],
        { $inc: { next: 1 } }, { "new": true, upsert: true }, callback);
};

const Sequence = mongoose.model("Sequence", SequenceSchema);

exports.Sequence = Sequence;
exports.preSaveSelfIncreasingId = function(schema, modelName, idField) {
    schema.pre("save", function(next) {
        const self = this;
        if (self.isNew) {
            Sequence.increment(modelName, (err, result) => {
                if (err) {
                    throw err;
                }
                self[idField] = result.value.next;
                next();
            });
        } else {
            next();
        }
    });
};
