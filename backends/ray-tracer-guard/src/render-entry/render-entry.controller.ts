import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DAILY_LIMIT, RenderEntryService } from './render-entry.service';

@Controller()
export class RenderEntryController {
  constructor(private readonly renderEntryService: RenderEntryService) {}

  @Get('can-render/:frontendAssignedId')
  async canRender(
    @Param('frontendAssignedId') frontendAssignedId: string,
  ): Promise<{ canRender: boolean }> {
    return {
      canRender:
        await this.renderEntryService.canIdBeRendered(frontendAssignedId),
    };
  }

  @Get('credits')
  async getCreditsCount(): Promise<{ count: number }> {
    return { count: await this.renderEntryService.getCreditsCount() };
  }
}
