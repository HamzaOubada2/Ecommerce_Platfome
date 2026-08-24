import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum Role {
    ADMIN = 'ADMIN',
    CUSTOMER = 'CUSTOMER'
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({unique: true})
    email:string;

    @Column()
    password:string;

    @Column({type: 'enum', enum: Role, default: Role.CUSTOMER})
    role:Role;


    @Column({nullable: true})
    refreshToken:string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    /*
    @OneToMany(() => Order, (order) => order.user)
    orders: Order[]
    */
}