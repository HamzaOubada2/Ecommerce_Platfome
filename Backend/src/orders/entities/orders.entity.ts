import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum OrderStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    CANCELLED = 'CANCELLED'
}

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.orders, {onDelete: 'CASCADE' /*If the user is deleted → requests are automatically deleted as a result.*/})
    user:User;

    @Column({type:'decimal', precision: 10, scale:2})
    totalAmount:number;

    @Column({type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING})
    status: OrderStatus;

    @Column({nullable: true, unique: true})
    stripePaymentId: string;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;
}