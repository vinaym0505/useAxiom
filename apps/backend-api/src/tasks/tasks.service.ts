import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async approvePlan(projectId: string, tenantId: string) {
    const project = await this.prisma.client.project.findFirst({ where: { id: projectId, organizationId: tenantId } });
    if (!project) throw new NotFoundException();

    await this.prisma.client.task.updateMany({
      where: { projectId, status: 'PROPOSED' },
      data: { status: 'PENDING' }, 
    });

    return this.prisma.client.project.update({
      where: { id: projectId },
      data: { status: 'ACTIVE' },
    });
  }

  async updateTaskStatus(taskId: string, status: string, tenantId: string) {
    const task = await this.prisma.client.task.findFirst({
      where: { id: taskId, project: { organizationId: tenantId } },
    });
    if (!task) throw new NotFoundException();

    return this.prisma.client.task.update({
      where: { id: taskId },
      data: { status },
    });
  }
}
