import { Controller, Get, Query } from '@nestjs/common';
import { CloudinaryService } from '../services/cloudinary.service';
import {
    GetSignatureRequestDto,
    GetSignatureResponseDto,
} from '../dto/get-signature.dto';

@Controller('cloudinary')
export class CloudinaryController {
    constructor(private readonly cloudinaryService: CloudinaryService) { }

    @Get('signature')
    getSignature(
        @Query() query: GetSignatureRequestDto,
    ): GetSignatureResponseDto {
        const result= this.cloudinaryService.getSignature(query.subfolder);
        console.log('Cloudinary signature response:', result);
        return result;

        
    }
}
