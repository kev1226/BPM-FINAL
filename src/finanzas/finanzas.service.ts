import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AsientoContable } from './entities/asiento-contable.entity';
import { OrdenPago } from './entities/orden-pago.entity';

@Injectable()
export class FinanzasService {
  constructor(
    @InjectRepository(AsientoContable)
    private readonly asientoRepo: Repository<AsientoContable>,
    @InjectRepository(OrdenPago)
    private readonly ordenRepo: Repository<OrdenPago>,
  ) {}

  async registrarAsientoYOrden(data: {
    numero_factura: string;
    cedula: string;
    nombres: string;
    apellidos: string;
    monto: number;
    fecha_factura: string;
    cuenta_bancaria: string;
    banco: string;
  }) {
    const codigoAsiento = `AS-${Date.now()}`;
    const codigoOrden = `OP-${Date.now()}`;

    const asiento = this.asientoRepo.create({
      codigo_asiento: codigoAsiento,
      numero_factura: data.numero_factura,
      cedula: data.cedula,
      monto: data.monto,
      fecha: data.fecha_factura,
      descripcion: `Reembolso aprobado para ${data.nombres} ${data.apellidos}`,
    });
    await this.asientoRepo.save(asiento);

    const orden = this.ordenRepo.create({
      codigo_orden: codigoOrden,
      cedula: data.cedula,
      monto: data.monto,
      cuenta_bancaria: data.cuenta_bancaria,
      banco: data.banco,
      estado: 'pendiente',
    });
    await this.ordenRepo.save(orden);

    return {
      codigo_asiento: codigoAsiento,
      codigo_orden_pago: codigoOrden,
    };
  }
}
