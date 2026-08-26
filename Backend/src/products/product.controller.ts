import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors, UploadedFile } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ProductService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { Role } from "src/users/entities/user.entity";
import { Roles } from "src/auth/decorators/roles.decorator";
import { AuthGuard } from "src/auth/guard/auth.guard";
import { RolesGuard } from "src/auth/guard/roles.guard";
import { CloudinaryService } from "src/common/cloudinary/cloudinary.service";
type MulterFile = Express.Multer.File;

@Controller('products')
export class ProductsController {
    constructor(
        private readonly productService: ProductService,
        private readonly cloudinaryService: CloudinaryService, // 1. حقن الخدمة هنا
    ) {}

    @Get()
    findAll() {
        return this.productService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productService.findOne(id);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Post()
    @UseInterceptors(FileInterceptor('image')) // 2. استقبال الملف بـ Key اسمه 'image'
    async create(
        @UploadedFile() file: MulterFile,
        @Body() createProductDto: CreateProductDto,
    ) {
        let imageUrl: string | undefined;
        if (file) {
            imageUrl = await this.cloudinaryService.uploadImage(file);
        }

        return this.productService.create({
            ...createProductDto,
            imageUrl,
        });
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Put(':id')
    update(@Param('id') id: string, @Body() updateProductDto: Partial<CreateProductDto>) {
        return this.productService.update(id, updateProductDto);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productService.remove(id);
    }
}