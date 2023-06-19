import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Gallery, GallerySchema } from './schema/gallery.schema';
import { GalleryService } from './service/gallery.service';
import { GalleryController } from './controller/gallery.controller';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: Gallery.name, schema: GallerySchema }]),
  ],
  providers: [GalleryService],
  controllers: [GalleryController],
  exports: [],
})
export class GalleryModule {}
