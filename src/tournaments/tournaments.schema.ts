import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class Match {
  @Prop({ required: true })
  matchId: string;

  @Prop()
  label: string;

  @Prop()
  homeTeamIndex: number;

  @Prop()
  awayTeamIndex: number;

  @Prop({ default: 0 })
  homeScore: number;

  @Prop({ default: 0 })
  awayScore: number;

  @Prop({ default: false })
  isFinished: boolean;

  @Prop()
  nextMatchId?: string;

  @Prop()
  isHomeForNext?: boolean;
}

@Schema({ timestamps: true })
export class Tournament extends Document {
  @Prop({ required: true })
  patotaId: string;

  @Prop()
  title: string;

  @Prop()
  eventDate: Date;

  @Prop({ type: [String], default: [] })
  teamNames: string[];

  @Prop({ type: [[String]], default: [] })
  teams: string[][];

  @Prop({ type: [Object], default: [] })
  matches: Match[];

  createdAt: Date;
  updatedAt: Date;
}

export const TournamentSchema = SchemaFactory.createForClass(Tournament);

// ✅ Ensure getters are applied when converting to JSON
TournamentSchema.set('toJSON', { getters: true });
TournamentSchema.set('toObject', { getters: true });
