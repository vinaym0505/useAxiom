import { Controller, Post, Body, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('approve-plan/:projectId')
  approvePlan(@Request() req, @Param('projectId') projectId: string) {
    return this.tasksService.approvePlan(projectId, req.tenantId);
  }

  @Patch(':id/status')
  updateStatus(@Request() req, @Param('id') id: string, @Body('status') status: string) {
    return this.tasksService.updateTaskStatus(id, status, req.tenantId);
  }
}
