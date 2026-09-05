import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PatotasService } from './patotas.service';
import { PatotaDto } from './patotaDto.dto';
import { Patota } from './patotas.schema';
import { Types } from 'mongoose';
import { ResponsePatotaDto } from './responsePatota.dto';

@Controller('patotas')
export class PatotasController {
  constructor(private readonly patotasService: PatotasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() patotaData: PatotaDto): Promise<ResponsePatotaDto> {
    return this.patotasService.createPatota(patotaData);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<ResponsePatotaDto[]> {
    return this.patotasService.getAllPatotas();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<ResponsePatotaDto> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid Patota ID');
    }
    const patota = await this.patotasService.getPatotaById(id);
    if (!patota) throw new NotFoundException('Patota not found');
    return patota;
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<PatotaDto>,
  ): Promise<Patota> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid Patota ID');
    }

    const updated = await this.patotasService.updatePatota(id, updateData);
    if (!updated) throw new NotFoundException('Patota not found');
    return updated;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid Patota ID');
    }
    const deleted = await this.patotasService.deletePatota(id);
    if (!deleted) throw new NotFoundException('Patota not found');
  }
}
