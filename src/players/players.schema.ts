import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Player extends Document {
  @Prop({ required: true })
  patotaId: string;

  @Prop({ required: true })
  name: string;

  createdAt: Date;
  updatedAt: Date;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);

PlayerSchema.set('toJSON', { getters: true });
PlayerSchema.set('toObject', { getters: true });
