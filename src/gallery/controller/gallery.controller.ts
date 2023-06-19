import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  UseGuards,
  Post,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { UserAuthGuard } from 'src/user/guards/userAuth.guard';
import { User } from 'src/user/decorators/user.decorator';
import { plainToClass } from 'class-transformer';
import { AuthToken } from 'src/user/decorators/authToken.decorator';
import { IDecodedIdToken } from 'src/user/interface/iDecodedIdToken';
import { GalleryItemResponseDTO } from '../dto/response/galleryItemResponse.dto';
import { GalleryService } from '../service/gallery.service';
import { CreateGalleryItemRequestDTO } from '../dto/request/createGalleryItemRequest.dto';

@ApiTags('Gallery')
@ApiBearerAuth()
@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Get('all')
  @ApiOperation({
    description: 'Retrieves all gallery items',
  })
  @ApiResponse({ type: [GalleryItemResponseDTO] })
  @UseGuards(UserAuthGuard)
  async getGalleryItems(
    @User() user: any,
    @AuthToken() token: IDecodedIdToken,
  ): Promise<GalleryItemResponseDTO[]> {
    const galleryRes = await this.galleryService.list(null, null, null, null);

    if (!galleryRes) {
      return [];
    }

    const retRes = galleryRes.map((galleryItem) =>
      this.toGalleryModel(galleryItem),
    );

    return retRes;
  }

  @Post('create')
  @ApiOperation({
    description: 'Add gallery item',
  })
  @ApiResponse({ type: GalleryItemResponseDTO })
  @UseGuards(UserAuthGuard)
  async addToCart(
    @AuthToken() token: IDecodedIdToken,
    @User() user: any,
    @Body() body: CreateGalleryItemRequestDTO,
  ): Promise<GalleryItemResponseDTO> {
    const galleryRes = await this.galleryService.create(body);

    if (!galleryRes) {
      throw new BadRequestException();
    }

    const retRes = this.toGalleryModel(galleryRes);

    return retRes;
  }

  private toGalleryModel(entity: any): GalleryItemResponseDTO {
    return plainToClass(GalleryItemResponseDTO, entity, {
      excludeExtraneousValues: true,
    });
  }
}
