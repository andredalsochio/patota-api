import {
  Controller,
  Post,
  Get,
  Put,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TournamentsService } from './tournaments.service';

@Controller('patotas/:patotaId/tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('patotaId') patotaId: string,
    @Body('teams') teams: string[][],
    @Body('eventDate') eventDate?: Date,
    @Body('teamNames') teamNames?: string[],
    @Body('title') title?: string,
  ) {
    return this.tournamentsService.createTournament(patotaId, teams, eventDate, teamNames, title);
  }

  @Get()
  async findAll(@Param('patotaId') patotaId: string) {
    return this.tournamentsService.getTournamentsByPatota(patotaId);
  }

  @Put(':tournamentId/matches/:matchId')
  async updateMatch(
    @Param('patotaId') patotaId: string,
    @Param('tournamentId') tournamentId: string,
    @Param('matchId') matchId: string,
    @Body('homeScore') homeScore: number,
    @Body('awayScore') awayScore: number,
    @Body('isFinished') isFinished: boolean,
  ) {
    return this.tournamentsService.updateMatch(patotaId, tournamentId, matchId, homeScore, awayScore, isFinished);
  }
}
