import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { AiService } from './ai/ai.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly aiService: AiService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('projects/generate-plan')
  async generatePlan(@Body() body: { objective: string; targetDeadline?: string }) {
    console.log(
      `[useAxiom] Received HTTP request to generate project plan for objective: "${body.objective}"`
    );
    const orchestrator = this.aiService.getOrchestrator();
    return orchestrator.getPlanner().run({
      objective: body.objective,
      targetDeadline: body.targetDeadline
    });
  }

  @Post('projects/assign-tasks')
  async assignTasks(
    @Body() body: {
      tasks: Array<{ id: string; name: string; requiredSkills: string[] }>;
      team: Array<{ id: string; name: string; skills: string[]; workload: number }>;
    }
  ) {
    console.log(
      `[useAxiom] Received HTTP request to assign tasks: ${body.tasks?.length || 0} tasks to ${body.team?.length || 0} team members`
    );
    const orchestrator = this.aiService.getOrchestrator();
    return orchestrator.getAssigner().run({
      tasks: body.tasks,
      team: body.team
    });
  }

  @Post('ai/parse-message')
  async parseMessage(@Body() body: { threadId: string; message: string }) {
    console.log(
      `[useAxiom] Received HTTP request to parse conversation message: "${body.message}" (threadId: ${body.threadId})`
    );
    const orchestrator = this.aiService.getOrchestrator();
    return orchestrator.getConversation().run({
      threadId: body.threadId,
      message: body.message
    });
  }

  @Post('projects/analyze-risk')
  async analyzeRisk(
    @Body() body: {
      projectId: string;
      tasks: Array<{ id: string; name: string; status: string; estimatedHours: number }>;
    }
  ) {
    console.log(
      `[useAxiom] Received HTTP request to analyze project risks for projectId: "${body.projectId}"`
    );
    const orchestrator = this.aiService.getOrchestrator();
    return orchestrator.getReporting().run({
      projectId: body.projectId,
      tasks: body.tasks
    });
  }
}
