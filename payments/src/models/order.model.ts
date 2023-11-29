import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { prop, getModelForClass,plugin } from "@typegoose/typegoose";
import mongoose from "mongoose";
import { OrderStatus } from "@sagittickets/common";


interface OrderAttributes{
    id: string;
    status: OrderStatus;
    version: number;
    userId: string;
    price: number;
}

interface OrderDocument extends mongoose.Document {
    status: OrderStatus;
    version: number;
    userId: string;
    price: number;
}

@plugin(updateIfCurrentPlugin)

export class OrderClass {
    @prop({ required: true })
    userId!: string

    @prop({ required: true, enum: Object.values(OrderStatus), default: OrderStatus.Created })
    status!: string;

    @prop({ default: 0, version: true })
    version!: number;
    
    @prop({ required: true})
    price!: number;

    public static createOrder (attrs: OrderAttributes) {
        return new OrderModel({
            _id: attrs.id,
            status: attrs.status,
            version: attrs.version,
            userId: attrs.userId,
            price: attrs.price
        })
    }
}


const OrderModel = getModelForClass(OrderClass, {
    schemaOptions: {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            }
        },
        versionKey: 'version'
    }
})

export {OrderModel}

