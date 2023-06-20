import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { UploadService } from './service/upload.service';
import { UploadController } from './controller/upload.controller';

@Module({
  imports: [UserModule],
  providers: [UploadService],
  controllers: [UploadController],
  exports: [],
})
export class CommonModule {}
