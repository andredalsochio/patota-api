import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Patota, PatotaSchema } from './patotas.schema';
import { PatotasController } from './patotas.controller';
import { PatotasService } from './patotas.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Patota.name, schema: PatotaSchema }]),
  ],
  controllers: [PatotasController],
  providers: [PatotasService],
  exports: [PatotasService],
})
export class PatotasModule {}
