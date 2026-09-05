import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Event, EventSchema } from './events.schema';
import { PatotasModule } from '../patotas/patotas.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    PatotasModule
  ],
  controllers: [EventsController],
  providers: [EventsService]
})
export class EventsModule {}
