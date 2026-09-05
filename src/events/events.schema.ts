import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Event extends Document {
  @Prop({ required: true })
  patotaId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  date: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);

EventSchema.set('toJSON', { getters: true });
EventSchema.set('toObject', { getters: true });
