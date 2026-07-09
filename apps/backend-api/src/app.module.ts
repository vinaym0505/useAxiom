import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { QueueModule } from './modules/queue/queue.module';
import { WhatsappModule } from './modules/whatsapp/whatsapp.module';
import { AiModule } from './ai/ai.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { ProjectsModule } from './projects/projects.module';
import { MilestonesModule } from './milestones/milestones.module';
import { TasksModule } from './tasks/tasks.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { TenantMiddleware } from './middleware/tenant.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    QueueModule,
    WhatsappModule,
    NotificationsModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    OrganizationsModule,
    ProjectsModule,
    MilestonesModule,
    TasksModule,
    AssignmentsModule,
    AnalyticsModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: import('@nestjs/common').MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
