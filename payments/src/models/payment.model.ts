import mongoose from "mongoose";
import { prop, getModelForClass } from "@typegoose/typegoose";


interface PaymentAttributes {
    orderId: string;
    stripeId: string;
}

interface PaymentDocument extends mongoose.Document{
    orderId: string;
    stripeId: string;
}


class PaymentClass {
    @prop({ required: true })
    orderId!: string;

    @prop({ required: true })
    stripeId!: string;



    public static createPayment (attrs: PaymentAttributes) {
        return new PaymentModel(attrs);
    }
}


const PaymentModel = getModelForClass(PaymentClass, {
    schemaOptions: {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            }
        }
    }
})


export {PaymentModel}