import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary } from "cloudinary";


@Injectable()
export class CloudinaryService {
    constructor(private configService: ConfigService) {
        cloudinary.config({
            cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET')
        })
    }


    async uploadImage(file: { buffer: Buffer; mimetype: string }): Promise<string> {
        return new Promise((resolve,reject) => {
            const upload = cloudinary.uploader.upload_stream(
                { folder: 'ecommerce_products'},
                (error, result) => {
                    if (error || !result) return reject("Echec Upload Image");
                    resolve(result.secure_url);
                },
            );
            upload.end(file.buffer);
        })
    }
}