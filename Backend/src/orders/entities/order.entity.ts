import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @ManyToOne(() => User)
    user: User;

    @OneToMany(() => OrderItem, (item) => item.order, {cascade: true})
    items: OrderItem[];

    @Column({type: 'decimal', precision: 10, scale: 2})
    totalAmount = number;


    @Column({type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING})
    status:OrderStatus;


    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updateAt: Date;
}

//this represent all Order with OrderId, User, Total , status