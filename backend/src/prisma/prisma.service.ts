import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../generated/prisma/client.js';

// The one PrismaClient for the whole app. Inject PrismaService wherever you
// need the database; never create your own PrismaClient.
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor() {
    super({ adapter: new PrismaLibSql({ url: process.env.DATABASE_URL! }) });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
