import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player } from './players.schema';
import { PatotasService } from '../patotas/patotas.service';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel(Player.name) private playerModel: Model<Player>,
    private patotasService: PatotasService,
  ) {}

  async createPlayer(patotaId: string, name: string): Promise<Player> {
    const patota = await this.patotasService.getPatotaById(patotaId);
    if (!patota) {
      throw new NotFoundException('Patota not found');
    }

    const newPlayer = new this.playerModel({
      patotaId,
      name,
    });

    return newPlayer.save();
  }

  async getPlayersByPatota(patotaId: string): Promise<Player[]> {
    return this.playerModel.find({ patotaId }).sort({ name: 1 }).exec();
  }

  async deletePlayer(playerId: string): Promise<void> {
    await this.playerModel.findByIdAndDelete(playerId).exec();
  }
}
