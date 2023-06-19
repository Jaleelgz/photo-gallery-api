// import {
//     Controller,
//     Post,
//     UseInterceptors,
//     UploadedFiles,
//     BadRequestException,
//     UseGuards,
//     Delete,
//     Param,
//     Res,
//     HttpStatus,
//     NotFoundException,
//   } from '@nestjs/common';
//   import { FilesInterceptor } from '@nestjs/platform-express';
//   import {
//     ApiBasicAuth,
//     ApiBody,
//     ApiConsumes,
//     ApiOperation,
//     ApiResponse,
//     ApiTags,
//   } from '@nestjs/swagger';
//   import * as path from 'path';
//   import { Response } from 'express';
// import { UserAuthGuard } from 'src/user/guards/userAuth.guard';
  
//   const validateFileFilter = (req, file, callback) => {
//     const ext = path.extname(file.originalname);
  
//     if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
//       req.fileValidationError = 'Invalid file type';
//       return callback(new BadRequestException('Invalid file type'), false);
//     }
  
//     if (file.size > parseInt(process.env.MAX_IMAGE_SIZE_IN_BYTES)) {
//       req.fileValidationError = 'File size exceeded';
//       return callback(new BadRequestException('File size exceeded'), false);
//     }
//     return callback(null, true);
//   };
  
//   @Controller('upload')
//   @ApiTags('Upload')
//   export class UploadController {
//     constructor(private readonly uploadService: UploadService) {}
  
//     @ApiBasicAuth()
//     @Post('multiple_images')
//     @ApiConsumes('multipart/form-data')
//     @ApiBody({
//       description: 'Upload multiple images',
//       type: 'multipart/form-data',
//       schema: {
//         type: 'object',
//         properties: {
//           files: {
//             type: 'array',
//             items: {
//               type: 'string',
//               format: 'binary',
//             },
//           },
//         },
//       },
//     })
//     @ApiOperation({ description: 'Uploads files to s3' })
//     @ApiResponse({
//       status: 201,
//       description:
//         'Successfully uploaded the image and the image path is returned',
//     })
//     @UseInterceptors(
//       FilesInterceptor('files', 10, {
//         fileFilter: validateFileFilter,
//       }),
//     )
//     @UseGuards(UserAuthGuard)
//     async uploadFilesToS3(
//       @UploadedFiles() files: Express.Multer.File[],
//     ): Promise<string[]> {
//       const uploadRes = await this.uploadService.uploadImages(files);
  
//       if (!uploadRes || uploadRes?.length === 0) {
//         throw new BadRequestException('Failed to upload images!.');
//       }
  
//       return uploadRes;
//     }
  
//     @Delete('delete/:url')
//     @ApiOperation({ description: 'Delete existing img' })
//     @ApiResponse({
//       status: 204,
//       description: 'Successfully deleted img',
//     })
//     @Roles(RoleEnum.ADMIN)
//     @UseGuards(AuthGuard, RolesGuard)
//     async deleteFile(
//       @Param('url') url: string,
//       @Res() response: Response,
//     ): Promise<Response> {
//       const result = await this.uploadService.deleteAllFiles([url]);
//       if (!result) throw new NotFoundException();
  
//       return response.status(HttpStatus.NO_CONTENT).json();
//     }
//   }
  