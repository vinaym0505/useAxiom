import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { AiService } from '../src/ai/ai.service';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let moduleFixture: TestingModule;

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/projects/generate-plan (POST)', () => {
    return request(app.getHttpServer())
      .post('/projects/generate-plan')
      .send({ objective: 'Build a monorepo', targetDeadline: '2026-12-31' })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('milestones');
        expect(Array.isArray(res.body.milestones)).toBe(true);
      });
  });

  it('/projects/assign-tasks (POST)', () => {
    return request(app.getHttpServer())
      .post('/projects/assign-tasks')
      .send({
        tasks: [
          { id: 'task-101', name: 'Scaffold APIs', requiredSkills: ['NestJS'] }
        ],
        team: [
          { id: 'dev-2', name: 'Bob', skills: ['NestJS'], workload: 2 }
        ]
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('assignments');
        expect(Array.isArray(res.body.assignments)).toBe(true);
        expect(res.body.assignments[0]).toHaveProperty('taskId', 'task-101');
      });
  });

  it('/ai/parse-message (POST)', async () => {
    await request(app.getHttpServer())
      .post('/ai/parse-message')
      .send({
        threadId: 'employee-whatsapp-thread',
        message: 'I am blocked waiting on Figma mockups'
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('reply');
        expect(res.body).toHaveProperty('intent', 'BLOCKED');
        expect(res.body.extractedParameters).toHaveProperty('blockReason');
      });

    // Check that memory has stored both user message and assistant reply
    const aiService = moduleFixture.get(AiService);
    const memory = (aiService.getOrchestrator().getConversation() as any).memory;
    const history = await memory.getShortTermContext('employee-whatsapp-thread');
    expect(history.length).toBe(2);
    expect(history[0].role).toBe('user');
    expect(history[0].content).toBe('I am blocked waiting on Figma mockups');
    expect(history[1].role).toBe('assistant');
    expect(history[1].content).toContain('blocked');
  });

  it('/projects/analyze-risk (POST)', () => {
    return request(app.getHttpServer())
      .post('/projects/analyze-risk')
      .send({
        projectId: 'project-99',
        tasks: [
          { id: 'task-101', name: 'Scaffold APIs', status: 'COMPLETED', estimatedHours: 8 }
        ]
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('riskScore');
        expect(res.body).toHaveProperty('riskLevel');
        expect(res.body).toHaveProperty('reasoning');
        expect(Array.isArray(res.body.suggestedActionItems)).toBe(true);
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
