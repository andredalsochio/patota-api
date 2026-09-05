import { Controller, Post, Get, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('patotas/:patotaId/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('patotaId') patotaId: string,
    @Body('title') title: string,
    @Body('date') date: string,
  ) {
    return this.eventsService.createEvent(patotaId, title, new Date(date));
  }

  @Get()
  async findAll(@Param('patotaId') patotaId: string) {
    return this.eventsService.getEventsByPatota(patotaId);
  }

  @Delete(':eventId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('eventId') eventId: string) {
    await this.eventsService.deleteEvent(eventId);
  }
}
