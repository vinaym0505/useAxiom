import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { AuthGuard } from '@nestjs/passport';
import { TenantGuard } from '../common/guards/tenant.guard';

@UseGuards(AuthGuard('jwt'), TenantGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  createProject(@Request() req: any, @Body() body: any) {
    return this.projectsService.createProject({
      ...body,
      organizationId: req.user.organizationId
    });
  }

  @Get()
  getProjects(@Request() req: any) {
    return this.projectsService.getProjects(req.user.organizationId);
  }

  @Get(':id')
  getProjectById(@Request() req: any, @Param('id') id: string) {
    return this.projectsService.getProjectById(id, req.user.organizationId);
  }
}
