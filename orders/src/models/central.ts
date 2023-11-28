import { getModelForClass } from "@typegoose/typegoose";

import { TicketClass } from "./ticket.model";
import { OrderClass } from "./order.model";

export const TicketModel = getModelForClass(TicketClass, {
    schemaOptions: {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
        versionKey: 'version'
    },
});

export const OrderModel = getModelForClass(OrderClass, {
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

