import { preSaveSelfIncreasingId } from "./sequence";
import { Schema, Document, Model, model } from "mongoose";
import { IUserDocument } from "./interfaces/IUserDocument";
import * as bcrypt from "bcryptjs";
import { _clonedObjectWithoutProperties } from "./utils";

export interface IUser extends IUserDocument {
    password: string;
}

export interface IUserModel extends Model<IUser> {
    findByUserId(id: number): Promise<IUserDocument>;
    findByUsername(username: string): Promise<IUserDocument>;
    authenticate(username: string, password: string): Promise<IUserDocument>;
}

const UserSchema = new Schema({
    id: { type: Number, index: { unique: true } },
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true, select: false },
    avatar: { type: String },
    bio: { type: String },
});

const modelName = "User";

// self increasing id
preSaveSelfIncreasingId(UserSchema, modelName, "id");

// password
UserSchema.path("password").set((v: string) => {
    const hash = bcrypt.hashSync(v, 12);
    return hash;
});

UserSchema.statics.findByUserId = async function(id: number) {
    return this.findOne({ id });
};

UserSchema.statics.findByUsername = function(username: string) {
    return this.findOne({ username });
};

// if matched return user, else return null
UserSchema.statics.authenticate = async (username: string, password: string) => {
    if (!username || !password) {
        throw new Error("username and password required");
    }
    const user = await User.findOne({ username }).select("+password");
    if (!user) { return null; }
    const matched = await bcrypt.compare(password, user.password);
    return matched ? _clonedObjectWithoutProperties(user, "password") : null;
};

// TODO: change to be static method? (can deal with JSON obj and User obj)
// 去掉敏感数据(比如password)
UserSchema.methods.toJSON = function() {
    return {
        id: this.id,
        username: this.username,
        bio: this.bio,
        avatar: this.avatar
    };
};

const User: IUserModel = model<IUser, IUserModel>(modelName, UserSchema);

export default User;
