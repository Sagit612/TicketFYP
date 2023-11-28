import { prop, getModelForClass, ReturnModelType, plugin } from "@typegoose/typegoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttrs {
    title: string;
    price: number;
    photo_id?: string;
    photo_url?: string;
    userId: string;
}
@plugin(updateIfCurrentPlugin)

class TicketClass {
    @prop({ required: true })
    title!: string;

    @prop({ required: true })
    price!: number;

    @prop({required: false})
    photo_id!: string;

    @prop({required: false})
    photo_url!: string;

    @prop({ required: true })
    userId!: string;

    @prop()
    orderId?: string;

    @prop({ default: 0, version: true })
    version!: number;

    public static createTicket(this: ReturnModelType<typeof TicketClass>, attrs: TicketAttrs) {
        return new TicketModel(attrs);
    }
}



const TicketModel = getModelForClass(TicketClass, {
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

// TicketModel.schema.plugin(updateIfCurrentPlugin);

export { TicketModel };
