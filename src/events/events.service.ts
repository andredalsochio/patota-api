import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './events.schema';
import { PatotasService } from '../patotas/patotas.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    private patotasService: PatotasService,
  ) {}

  async createEvent(patotaId: string, title: string, date: Date): Promise<Event> {
    const patota = await this.patotasService.getPatotaById(patotaId);
    if (!patota) {
      throw new NotFoundException('Patota not found');
    }

    const newEvent = new this.eventModel({
      patotaId,
      title,
      date,
    });

    return newEvent.save();
  }

  async getEventsByPatota(patotaId: string): Promise<Event[]> {
    return this.eventModel.find({ patotaId }).sort({ date: 1 }).exec();
  }

  async deleteEvent(eventId: string): Promise<void> {
    await this.eventModel.findByIdAndDelete(eventId).exec();
  }
}
