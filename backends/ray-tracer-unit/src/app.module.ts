import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { RenderEntry, RenderEntrySchema } from './render-entry.schema';
import { RenderEntryService } from './render-entry.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL),
    MongooseModule.forFeature([
      { name: RenderEntry.name, schema: RenderEntrySchema },
    ]),
  ],
  controllers: [AppController],
  providers: [RenderEntryService],
})
export class AppModule {}
