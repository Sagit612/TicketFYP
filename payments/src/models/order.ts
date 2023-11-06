import mongoose from "mongoose";
import { OrderStatus } from "@sagittickets/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

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

interface OrderModel extends mongoose.Model<OrderDocument> {
    build(attrs: OrderAttributes): OrderDocument
}

const orderSchema = new mongoose.Schema({
    status: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
})

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttributes) => {
    return new Order({
        _id: attrs.id,
        status: attrs.status,
        version: attrs.version,
        userId: attrs.userId,
        price: attrs.price
    })
}

const Order = mongoose.model<OrderDocument, OrderModel>('Order', orderSchema)

export { Order }