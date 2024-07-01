import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RenderEntryDocument = HydratedDocument<RenderEntry>;

@Schema()
export class RenderEntry {
  @Prop()
  createdAt: Date;
}

export const RenderEntrySchema = SchemaFactory.createForClass(RenderEntry);
