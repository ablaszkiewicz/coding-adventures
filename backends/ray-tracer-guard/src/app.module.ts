import { Module } from '@nestjs/common';

import { RenderEntryModule } from './render-entry/render-entry.module';

@Module({
  imports: [RenderEntryModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
