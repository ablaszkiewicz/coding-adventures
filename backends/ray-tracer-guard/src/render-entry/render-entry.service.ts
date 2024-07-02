import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RenderEntry } from './render-entry.schema';
import { Model, Types } from 'mongoose';

export const DAILY_LIMIT = 100;
const FRESH_ID_MINUTES = 1;

@Injectable()
export class RenderEntryService {
  private cachedIdsWithTimestamps: Record<string, number> = {};

  constructor(
    @InjectModel(RenderEntry.name) private renderEntryModel: Model<RenderEntry>,
  ) {}

  async record(frontendAssignedId: string): Promise<void> {
    const existing = await this.renderEntryModel.findById(frontendAssignedId);

    if (existing) {
      return;
    }
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

  async canIdBeRendered(frontendAssignedId: string): Promise<boolean> {
    console.log('Checking ' + frontendAssignedId);

    if (this.getFromCache(frontendAssignedId)) {
      console.log('returning true from cache');

      return true;
    }

    const existing = await this.renderEntryModel.findById(frontendAssignedId);

    if (!existing) {
      try {
        if ((await this.getCreditsCount()) <= 0) {
          console.log('returning false due to credits count');

          return false;
        }

        const renderEntryModel = new this.renderEntryModel({
          createdAt: new Date().toString(),
          asd: 5,
        });

        renderEntryModel._id = new Types.ObjectId(frontendAssignedId);

        await renderEntryModel.save();
        this.cachedIdsWithTimestamps[frontendAssignedId] = new Date().getTime();
        console.log('returning true in try catch');

        return true;
      } catch {}
      console.log('returning true');

      return true;
    }

    const now = new Date();
    const createdAt = new Date(existing.createdAt);

    console.log('returning condition');
    console.log('Now is ' + now);
    console.log('Created at is ' + createdAt);

    return now.getTime() - createdAt.getTime() < FRESH_ID_MINUTES * 60 * 1000;
  }

  getFromCache(frontendAssignedId: string): boolean {
    const now = new Date().getTime();
    const timestamp = this.cachedIdsWithTimestamps[frontendAssignedId];

    if (timestamp && now - timestamp < FRESH_ID_MINUTES * 60 * 1000) {
      return true;
    }

    return false;
  }
}
