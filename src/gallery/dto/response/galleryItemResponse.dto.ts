import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class GalleryItemResponseDTO {
  @ApiProperty({
    title: 'Id',
  })
  @Transform(({ key, obj }) => obj[key]?.toString())
  @Expose()
  id: string;

  @ApiProperty({
    title: 'Title',
  })
  @Expose()
  title: string;

  @ApiProperty({
    title: 'Image',
  })
  @Expose()
  image: string;
}
