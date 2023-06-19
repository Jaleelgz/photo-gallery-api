import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGalleryItemRequestDTO {
  @ApiProperty({
    title: 'Title',
  })
  @IsString()
  @IsNotEmpty()
  @Expose()
  title: string;

  @ApiProperty({
    title: 'Image',
  })
  @IsString()
  @IsNotEmpty()
  @Expose()
  image: string;
}
