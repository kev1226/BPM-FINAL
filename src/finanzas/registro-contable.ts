import { createWorker } from '@camunda8/sdk';
import { AppDataSource } from '../data-source'; // conexión TypeORM
import { FinanzasService } from './finanzas.service';

const dataSource = await AppDataSource.initialize();
const finanzasService = new FinanzasService(
  dataSource.getRepository('AsientoContable'),
  dataSource.getRepository('OrdenPago'),
);

createWorker({
  taskType: 'registro-contable',
  taskHandler: async ({ variables, complete }) => {
    const {
      numero_factura,
      cedula,
      nombres,
      apellidos,
      monto,
      fecha_factura,
      cuenta_bancaria,
      banco,
    } = variables;

    const resultado = await finanzasService.registrarAsientoYOrden({
      numero_factura,
      cedula,
      nombres,
      apellidos,
      monto,
      fecha_factura,
      cuenta_bancaria,
      banco,
    });

    await complete.success({
      registro_contable_ok: true,
      ...resultado,
    });
  },
});
