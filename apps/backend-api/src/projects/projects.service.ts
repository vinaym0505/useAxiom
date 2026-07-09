import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: { name: string; description?: string }) {
    return this.prisma.client.project.create({
      data: {
        ...data,
        organizationId: tenantId,
        status: 'PROPOSED',
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.client.project.findMany({ where: { organizationId: tenantId } });
  }

  async findOne(tenantId: string, id: string) {
    const project = await this.prisma.client.project.findFirst({ 
      where: { id, organizationId: tenantId }, 
      include: { tasks: true, milestones: true } 
    });
    if (!project) throw new NotFoundException();
    return project;
  }
}
