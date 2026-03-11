import { Injectable } from '@nestjs/common';
import { UserSeeder } from './user.seed';

@Injectable()
export class DatabaseSeeder {
  constructor(
    private readonly userSeeder: UserSeeder,
  ) {}

  async seed() {
    console.log('🌱 Starting database seeding...\n');

    try {
      await this.userSeeder.seed();
      
      console.log('\n✅ Database seeding completed successfully!');
    } catch (error) {
      console.error('\n❌ Database seeding failed:', error);
      throw error;
    }
  }

  async clear() {
    console.log('🧹 Clearing database...\n');

    try {
      await this.userSeeder.clear();
      
      console.log('\n✅ Database cleared successfully!');
    } catch (error) {
      console.error('\n❌ Database clearing failed:', error);
      throw error;
    }
  }
}