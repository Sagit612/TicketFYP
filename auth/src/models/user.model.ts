import { prop, ReturnModelType, getModelForClass, pre } from "@typegoose/typegoose";
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

@pre<UserClass>('save',async function (done)  {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this!.password);
        this.password = hashed;
      }
    done();
})



class UserClass {
    @prop ({required: true})
    name!: string;
    
    @prop ({required: true})
    email!: string;
    
    @prop ({required: false})
    password!: string;

    @prop ({required: false})
    googleId!: string;

    @prop ({required: false})
    verified_email!: boolean;

    @prop ({required: false})
    picture!: string;

    public static createUser(this: ReturnModelType<typeof UserClass>, attrs: UserAttrs): any {
        return new UserModel(attrs);
    }

    public static async findAndCreate(
        this: ReturnModelType<typeof UserClass>, 
        query: FilterQuery<UserAttrs>, update: UpdateQuery<UserAttrs>, options: QueryOptions
    ): Promise<any> {
        return await this.findOneAndUpdate(query, update, options);
    }
}

const UserModel = getModelForClass(UserClass, {
    schemaOptions: {
        toJSON: {
            transform(doc, ret) {
             ret.id = ret._id;
             delete ret._id;
             delete ret.password;
             delete ret.__v;
            } 
         } 
    }
})

export { UserModel }