import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Project, ProjectStatus } from '@useaxiom/database';
import { CreateProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(organizationId: string, managerId: string, dto: CreateProjectDto): Promise<Project> {
    return this.prisma.project.create({
      data: {
        name: dto.name,
        objective: dto.objective,
        targetDeadline: dto.targetDeadline ? new Date(dto.targetDeadline) : null,
        status: ProjectStatus.PLANNING,
        organization: {
          connect: { id: organizationId },
        },
        manager: {
          connect: { id: managerId },
        },
      },
    });
  }

  async findAll(organizationId: string): Promise<Project[]> {
    return this.prisma.project.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(organizationId: string, id: string): Promise<Project | null> {
    return this.prisma.project.findFirst({
      where: {
        id,
        organizationId,
        deletedAt: null,
      },
    });
  }

  async updateStatus(organizationId: string, id: string, status: ProjectStatus): Promise<Project> {
    const project = await this.findOne(organizationId, id);
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found under your organization`);
    }
    return this.prisma.project.update({
      where: { id },
      data: { status },
    });
  }

  async softDeleteProject(organizationId: string, id: string) {
    const project = await this.findOne(organizationId, id);
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found under your organization`);
    }
    return this.prisma.project.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async approvePlan(organizationId: string, id: string) {
    const project = await this.findOne(organizationId, id);
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found under your organization`);
    }

    const updatedProject = await this.prisma.project.update({
      where: { id },
      data: { status: 'ACTIVE' },
    });

    await this.prisma.task.updateMany({
      where: {
        projectId: id,
        status: 'PROPOSED',
      },
      data: {
        status: 'PENDING',
      },
    });

    return updatedProject;
  }

  async generatePlan(organizationId: string, id: string) {
    const project = await this.findOne(organizationId, id);
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found under your organization`);
    }
    return {
      message: 'Plan generation triggered',
      jobId: `job_${Math.random().toString(36).substring(2, 11)}`,
      projectId: id,
    };
  }

  async getProjectTasks(organizationId: string, projectId: string) {
    const project = await this.findOne(organizationId, projectId);
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found under your organization`);
    }
    return this.prisma.task.findMany({
      where: {
        projectId: projectId,
        deletedAt: null,
      },
    });
  }

  async getProjectMilestones(organizationId: string, projectId: string) {
    const project = await this.findOne(organizationId, projectId);
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found under your organization`);
    }
    return this.prisma.milestone.findMany({
      where: {
        projectId: projectId,
        deletedAt: null,
      },
    });
  }
}
