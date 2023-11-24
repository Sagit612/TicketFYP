import mongoose, { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import { Password } from "../services/password.service";

interface UserAttrs{
    name: string;
    email: string;
    password?: string;
    googleId?: string;
    verified_email?: boolean;
    picture?: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
    createUser(attrs: UserAttrs): any;
    findAndCreate(query: FilterQuery<UserAttrs>, update: UpdateQuery<UserAttrs>, options: QueryOptions): any;
}

interface UserDoc extends mongoose.Document{
    name: string;
    email: string;
    password?: string;
    googleId?: string;
    verified_email?: boolean;
    picture?: string;
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
    },
    googleId: {
        type: String,
    },
    verified_email: {
        type: Boolean
    },
    picture: {
        type: String,
    }
}, {
    toJSON: {
       transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
       } 
    } 
});

userSchema.pre('save', async function(done) {
    if (this.isModified('password')){
        const hashed = await Password.toHash(this.get('password') as string);
        this.set('password', hashed);
    }
    done();
});

userSchema.statics.findAndCreate = async (query: FilterQuery<UserAttrs>, update: UpdateQuery<UserAttrs>, options: QueryOptions) => {
    return await User.findOneAndUpdate(query, update, options);
}

userSchema.statics.createUser = (attrs: UserAttrs) => {
    return new User(attrs);
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User }