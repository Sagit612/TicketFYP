import { prop, ReturnModelType, plugin } from "@typegoose/typegoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "./order.model";
import { TicketModel, OrderModel } from "./central";
import mongoose from "mongoose";

interface TicketAttrs {
    id: string;
    title: string;
    price: number;
    photo_id: string;
    photo_url: string;
}

export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    photo_id: string;
    photo_url: string;
    version: number;
    isReserved(): Promise<Boolean>
}

@plugin(updateIfCurrentPlugin)

export class TicketClass {
    @prop({ required: true })
    title!: string;

    @prop({ required: true, min: 0})
    price!: number;

    @prop({required: false})
    photo_id!: string;

    @prop({required: false})
    photo_url!: string;

    @prop({ default: 0, version: true })
    version!: number;

    public static createTicket(this: ReturnModelType<typeof TicketClass>, attrs: TicketAttrs) {
        return new TicketModel(
            {
                _id: attrs.id,
                title: attrs.title,
                price: attrs.price,
                photo_id: attrs.photo_id,
                photo_url: attrs.photo_url
            }
        );
    }
    public static findByEvent(this: ReturnModelType<typeof TicketClass>, event: { id: string, version: number }) {
        return this.findOne({
            _id: event.id,
            version: event.version - 1
        })
    }

    public async isReserved() {
        const existingOrder = await OrderModel.findOne({
            ticket: this, 
            status: {
                $in: [
                    OrderStatus.Created,
                    OrderStatus.AwaitingPayment,
                    OrderStatus.Complete
                ]
            }
        });
        return !!existingOrder;
    }
}






