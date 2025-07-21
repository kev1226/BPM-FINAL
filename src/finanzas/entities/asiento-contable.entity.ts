import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('asientos_contables')
export class AsientoContable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  codigo_asiento: string;

  @Column()
  numero_factura: string;

  @Column()
  cedula: string;

  @Column('decimal', { precision: 10, scale: 2 })
  monto: number;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ type: 'text' })
  descripcion: string;
}
