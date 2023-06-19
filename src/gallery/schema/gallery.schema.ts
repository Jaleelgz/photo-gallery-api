import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type GalleryDocument = HydratedDocument<Gallery>;

@Schema({
  collection: 'gallery',
  timestamps: true,
  collation: { locale: 'en', strength: 2 },
})
export class Gallery {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id: string;

  @Prop({ trim: true, unique: true, required: true })
  title: string;

  @Prop({ trim: true, unique: true, required: true })
  image: string;
}

export const GallerySchema = SchemaFactory.createForClass(Gallery);

GallerySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});
