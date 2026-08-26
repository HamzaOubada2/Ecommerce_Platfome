import { Category } from "src/categories/entities/category.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('products')
export class Product{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    title:string;

    @Column({type:'text', nullable: true})
    description:string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price:number;


    @Column({ type: 'int', default: 0 })
    stock:number;

    @Column({ nullable: true })
    imageUrl: string;

    @ManyToOne(() => Category, (category) => category.products, {onDelete: 'SET NULL'})
    category: Category;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;
}