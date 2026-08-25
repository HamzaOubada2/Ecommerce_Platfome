import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ProductService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { Role } from "src/users/entities/user.entity";
import { Roles } from "src/auth/decorators/roles.decorator";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/auth/guard/roles.guard";


@Controller('products')
export class ProductsController {
    constructor(
        private readonly productService: ProductService
    ) {}


    @Get()
    findAll() {
        return this.productService.findAll();
    }

    @Get(':id')
    findOne(@Param('id')id:string) {
        return this.productService.findOne(id);
    }


    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Post()
    create(@Body() createProductDto: CreateProductDto) {
        return this.productService.create(createProductDto);
    }


    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Put(':id')
    update(@Param('id') id:string, @Body() updateProductDto: Partial<CreateProductDto>) {
        return this.productService.update(id, updateProductDto);
    }


    
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(':id')
    remove(@Param('id') id:string) {
        return this.productService.remove(id);
    }

}