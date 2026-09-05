import { Controller, Post, Get, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PlayersService } from './players.service';

@Controller('patotas/:patotaId/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('patotaId') patotaId: string,
    @Body('name') name: string,
  ) {
    return this.playersService.createPlayer(patotaId, name);
  }

  @Get()
  async findAll(@Param('patotaId') patotaId: string) {
    return this.playersService.getPlayersByPatota(patotaId);
  }

  @Delete(':playerId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('playerId') playerId: string) {
    await this.playersService.deletePlayer(playerId);
  }
}
