import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { Product } from "src/products/entities/product.entity";



@Entity('order-items')
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id:string;


    @ManyToOne(() => Order, (order) => order.items, {onDelete: 'CASCADE'})
    order:Order;


    @ManyToOne(() => Product)
    product: Product;

    @Column({type: 'int'})
    quantity: number;


    @Column({type: 'decimal', precision: 10, scale:2})
    price: number;
}

// Present One Order 