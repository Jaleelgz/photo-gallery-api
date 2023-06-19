import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CRUDService } from '../../common/service/crud.service';
import { Gallery, GalleryDocument } from '../schema/gallery.schema';

@Injectable()
export class GalleryService extends CRUDService<GalleryDocument> {
  constructor(
    @InjectModel(Gallery.name)
    readonly galleryDataModel: Model<GalleryDocument>,
  ) {
    super(galleryDataModel);
  }
}
