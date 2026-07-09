import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { prisma } from '@useaxiom/database';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  // We use the shared prisma instance from @useaxiom/database
  public readonly client = prisma;

  async onModuleInit() {
    await this.client.$connect();
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}
