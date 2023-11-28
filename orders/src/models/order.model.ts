import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { prop, getModelForClass, ReturnModelType, plugin, Ref } from "@typegoose/typegoose";
import mongoose from "mongoose";
import { OrderStatus } from "@sagittickets/common";
import { TicketDoc, TicketClass } from "./ticket.model";
import { OrderModel, TicketModel } from "./central";
import { Order } from "./mongooseorder.model";


interface OrderAttrs {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
}

interface OrderDoc extends mongoose.Document {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
    version: number;
}

export { OrderStatus }


@plugin(updateIfCurrentPlugin)

export class OrderClass {
    @prop({ required: true })
    userId!: string

    @prop({ required: true, enum: Object.values(OrderStatus), default: OrderStatus.Created })
    status!: string;

    @prop()
    expiresAt!: Date

    @prop({ default: 0, version: true })
    version!: number;

    @prop({ref: () => TicketClass})
    ticket!: Ref<TicketClass>

    public static createOrder (attrs: OrderAttrs) {
        return new OrderModel(attrs);
    }
}


