import { Model, Types } from 'mongoose';
import { Patota } from './patotas.schema';
import { InjectModel } from '@nestjs/mongoose';
import { PatotaDto } from './patotaDto.dto';
import { Injectable } from '@nestjs/common';
import { ResponsePatotaDto } from './responsePatota.dto';

@Injectable()
export class PatotasService {
  constructor(@InjectModel(Patota.name) private _patotaModel: Model<Patota>) {}

  async createPatota(patotaData: PatotaDto): Promise<ResponsePatotaDto> {
    const patota = new this._patotaModel({
      title: patotaData.title,
      patotaOwner: patotaData.patotaOwner,
      patotaDate: patotaData.patotaDate,
      amountPlayers: patotaData.amountPlayers,
      monthlyValue: Types.Decimal128.fromString(
        patotaData.monthlyValue.toString(),
      ),

    });
    const createdPatota = await patota.save();
    return this.toDto(createdPatota);
  }

  async getAllPatotas(): Promise<ResponsePatotaDto[]> {
    const result = await this._patotaModel.find().exec();
    return result.map((patota) => this.toDto(patota));
  }

  async getPatotaById(id: string): Promise<ResponsePatotaDto | null> {
    const filters = { _id: id };
    const result = await this._patotaModel.findOne(filters).exec();
    if (!result) return null;
    return this.toDto(result);
  }

  async updatePatota(
    id: string,
    data: Partial<PatotaDto>,
  ): Promise<Patota | null> {
    return this._patotaModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async deletePatota(id: string): Promise<null | Patota> {
    return this._patotaModel.findByIdAndDelete(id).exec();
  }
  private toDto(patota: Patota): ResponsePatotaDto {
    return {
      id: patota._id?.toString(),
      title: patota.title,
      patotaOwner: patota.patotaOwner,
      patotaDate: patota.patotaDate,
      amountPlayers: patota.amountPlayers,
      monthlyValue: parseFloat(patota.monthlyValue.toString()),

      createdAt: patota.createdAt,
      updatedAt: patota.updatedAt,
    };
  }
}
