import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { AuthModule } from "src/auth/auth.module";
import { ProductsController } from "./product.controller";
import { ProductService } from "./products.service";



@Module({
    imports: [TypeOrmModule.forFeature([Product]), AuthModule],
    controllers:[ProductsController],
    providers: [ProductService]
})

export class ProductsModule{}