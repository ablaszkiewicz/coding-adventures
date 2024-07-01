import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RenderEntry } from './render-entry.schema';
import { Model, Types } from 'mongoose';

const DAILY_LIMIT = 100;

@Injectable()
export class RenderEntryService {
  constructor(
    @InjectModel(RenderEntry.name) private renderEntryModel: Model<RenderEntry>,
  ) {}

  async record(frontendAssignedId: string): Promise<void> {
    const existing = await this.renderEntryModel.findById(frontendAssignedId);

    if (existing) {
      return;
    }

    try {
      const renderEntryModel = new this.renderEntryModel({
        createdAt: new Date().toString(),
        asd: 5,
      });

      renderEntryModel._id = new Types.ObjectId(frontendAssignedId);

      await renderEntryModel.save();
    } catch {}
  }

  async getDailyCount(): Promise<number> {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    return this.renderEntryModel.countDocuments({
      createdAt: {
        $gte: yesterday,
      },
    });
  }

  async getCreditsCount(): Promise<number> {
    return DAILY_LIMIT - (await this.getDailyCount());
  }
}
