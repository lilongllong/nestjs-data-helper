import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument, Schema as schema } from 'mongoose';

export interface ICat {
  id: string;
  name: string;
  sex: 'male' | 'female';
  children?: ICat[];
  metaData: { fistName: string; lastName: string };
  updated: Date;
}

export type CatDocument = HydratedDocument<ICat>;

@Schema()
export class Cat {
  @Prop({ type: schema.Types.ObjectId, auto: true, alias: 'catID' })
  id: string;
  @Prop({ type: schema.Types.String, required: true })
  name: string;
  @Prop({ type: schema.Types.String, required: true })
  sex: string;
  @Prop({
    type: [{ type: schema.Types.ObjectId }],
    required: false,
    ref: 'Cat',
  })
  children: Cat[];
  @Prop(raw({ firstName: { type: String }, lastName: { type: String } }))
  metaData: Record<string, string>;
  @Prop({ type: schema.Types.Date, required: false, default: Date.now() })
  updated: Date;
}

export const CatSchema = SchemaFactory.createForClass(Cat);
