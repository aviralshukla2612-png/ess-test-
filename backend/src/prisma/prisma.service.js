const { Injectable, OnModuleInit, OnModuleDestroy } = require('@nestjs/common');
const { PrismaClient } = require('@prisma/client');

@Injectable()
class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

module.exports = { PrismaService };
