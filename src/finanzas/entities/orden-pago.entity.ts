import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('ordenes_pago')
export class OrdenPago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  codigo_orden: string;

  @Column()
  cedula: string;

  @Column('decimal', { precision: 10, scale: 2 })
  monto: number;

  @Column()
  cuenta_bancaria: string;

  @Column()
  banco: string;

  @Column()
  estado: string;

  @CreateDateColumn()
  fecha_creacion: Date;
}
