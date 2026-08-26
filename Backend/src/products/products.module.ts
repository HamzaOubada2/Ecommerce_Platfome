import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { AuthModule } from "src/auth/auth.module";
import { ProductsController } from "./product.controller";
import { ProductService } from "./products.service";
import { CloudinaryModule } from "src/common/cloudinary/cloudinary.module";



@Module({
    imports: [TypeOrmModule.forFeature([Product]), AuthModule, CloudinaryModule],
    controllers:[ProductsController],
    providers: [ProductService]
})

export class ProductsModule{}