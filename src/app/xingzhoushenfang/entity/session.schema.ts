import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

import { Document, Schema as schema } from 'mongoose';

export type SessionDocument = Session & Document;

@Schema()
export class Session extends Document {
  @Prop({ type: schema.Types.ObjectId, auto: true, alias: 'sessionId' })
  _id: string;

  @Prop({
    type: schema.Types.Date,
    required: true,
    index: true,
    default: Date.now(),
  })
  timestamp: Date;

  @Prop({ type: [schema.Types.Buffer], required: false })
  events: Buffer[];

  @Prop({ type: schema.Types.Mixed, required: false })
  metadata: Record<string, any>;
}
export const SessionSchema = SchemaFactory.createForClass(Session);
