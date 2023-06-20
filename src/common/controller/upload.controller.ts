import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBasicAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import * as path from 'path';
import { UserAuthGuard } from 'src/user/guards/userAuth.guard';
import { UploadService } from '../service/upload.service';

const validateFileFilter = (req, file, callback) => {
  const ext = path.extname(file.originalname);

  if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
    req.fileValidationError = 'Invalid file type';
    return callback(new BadRequestException('Invalid file type'), false);
  }

  if (file.size > parseInt(process.env.MAX_IMAGE_SIZE_IN_BYTES)) {
    req.fileValidationError = 'File size exceeded';
    return callback(new BadRequestException('File size exceeded'), false);
  }
  return callback(null, true);
};

@Controller('upload')
@ApiTags('Upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiBasicAuth()
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload multiple images',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiOperation({ description: 'Uploads files to s3' })
  @ApiResponse({
    status: 201,
    description:
      'Successfully uploaded the image and the image path is returned',
  })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      fileFilter: validateFileFilter,
    }),
  )
  @UseGuards(UserAuthGuard)
  async uploadFilesToS3(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<string> {
    try {
      const img = await this.uploadService.uploadImage(files[0]);

      return img;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
