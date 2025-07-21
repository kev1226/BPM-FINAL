import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsientoContable } from './entities/asiento-contable.entity';
import { OrdenPago } from './entities/orden-pago.entity';
import { FinanzasService } from './finanzas.service';

@Module({
  imports: [TypeOrmModule.forFeature([AsientoContable, OrdenPago])],
  providers: [FinanzasService],
  exports: [FinanzasService], // 👈 importante para usar en el worker
})
export class FinanzasModule {}
