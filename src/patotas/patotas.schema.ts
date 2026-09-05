import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Patota extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  patotaOwner: string;

  @Prop({ required: true })
  patotaDate: Date;

  @Prop({ required: true })
  amountPlayers: number;

  @Prop({
    type: MongooseSchema.Types.Decimal128,
    required: true,
    get: (value: Types.Decimal128) => parseFloat(value?.toString() ?? '0'),
    set: (value: number) => Types.Decimal128.fromString(value.toString()),
  })
  monthlyValue: Types.Decimal128;
  createdAt: Date;
  updatedAt: Date;
}

export const PatotaSchema = SchemaFactory.createForClass(Patota);

// ✅ Ensure getters are applied when converting to JSON
PatotaSchema.set('toJSON', { getters: true });
PatotaSchema.set('toObject', { getters: true });
