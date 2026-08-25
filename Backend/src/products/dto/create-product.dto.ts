import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator";


export class CreateProductDto {

    @IsNotEmpty()
    @IsString()
    title:string;


    @IsOptional()
    @IsString()
    description?:string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    price:number;


    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    stock:number;

    @IsOptional()
    @IsUUID()
    categoryId?:string;
}