import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SignUpNInResponseDTO {
  @ApiProperty()
  @Expose()
  userToken: string;

  @ApiProperty()
  @Expose()
  userId: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  phone: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  address?: string;
}
