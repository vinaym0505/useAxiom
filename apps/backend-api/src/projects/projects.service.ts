import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async createProject(data: { name: string, description?: string, organizationId: string }) {
    return this.prisma.client.project.create({
      data: {
        name: data.name,
        description: data.description,
        organizationId: data.organizationId,
      }
    });
  }

  async getProjects(organizationId: string) {
    return this.prisma.client.project.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getProjectById(projectId: string, organizationId: string) {
    const project = await this.prisma.client.project.findFirst({
      where: { id: projectId, organizationId }
    });
    
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found in your organization`);
    }

    return project;
  }
}
