import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { Repository } from "typeorm";
import { CreateProductDto } from "./dto/create-product.dto";
import { NotFoundException } from "@nestjs/common";



export class ProductService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) {}

    // Create Product
    async create(createProductDto: CreateProductDto) {
        const product = this.productRepository.create({
            ...createProductDto,
            category: createProductDto.categoryId ? { id: createProductDto.categoryId } : undefined, // if categoryId = 2 soo category: { id: 3 } --> This means: Link this product to the category whose ID is 3.
        });
        return await this.productRepository.save(product);
    }

    // FindAll
    async findAll() {
        return await this.productRepository.find({ relations: { category: true } });
    }


    // FindOne
    async findOne(id:string) {
        const product = await this.productRepository.findOne({ where: { id }, relations: { category: true } });
        if(!product) throw new NotFoundException("Product Not Found!");
        return product;
    }


    // Update
    async update(id:string, updateProductDto: Partial<CreateProductDto>) {
        const product = await this.findOne(id);

        Object.assign(product, { // Object.assign ==> It integrates new data into the product.
            ...updateProductDto, 
            category: updateProductDto.categoryId
                ? { id: updateProductDto.categoryId }
                : product.category,
        });

        return await this.productRepository.save(product);
    }

    // Remove
    async remove(id:string) {
        const product = await this.findOne(id);
        return await this.productRepository.remove(product);
    }
}