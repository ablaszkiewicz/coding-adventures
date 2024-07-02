import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { RenderEntryService } from './render-entry.service';
import { RenderEntry, RenderEntrySchema } from './render-entry.schema';
import { RenderEntryController } from './render-entry.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL),
    MongooseModule.forFeature([
      { name: RenderEntry.name, schema: RenderEntrySchema },
    ]),
  ],
  controllers: [RenderEntryController],
  providers: [RenderEntryService],
})
export class RenderEntryModule {}
