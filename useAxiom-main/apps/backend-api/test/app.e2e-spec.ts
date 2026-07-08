import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { prisma } from '@useaxiom/database';

describe('useAxiom Backend Routes (e2e)', () => {
  let app: INestApplication<App>;
  const orgId = '77777777-7777-7777-7777-777777777777';

  beforeAll(async () => {
    await prisma.organization.upsert({
      where: { id: orgId },
      update: {},
      create: {
        id: orgId,
        name: 'Sprint 2 Test Org',
      },
    });
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  it('/api/v1 (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1')
      .expect(200)
      .expect('Hello World!');
  });

  describe('Project CRUD & Workflows', () => {
    let createdProjectId: string;

    it('POST /api/v1/projects (Create Project)', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/projects')
        .set('x-organization-id', orgId)
        .send({
          name: 'Sprint 2 Launch',
          objective: 'Deliver Project CRUD workflows',
          target_deadline: '2026-11-20T00:00:00.000Z',
        })
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body.status).toBe('PLANNING');
      expect(res.body.name).toBe('Sprint 2 Launch');
      expect(res.body.organization_id).toBe(orgId);

      createdProjectId = res.body.id;
    });

    it('GET /api/v1/projects (List Projects)', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/projects')
        .set('x-organization-id', orgId)
        .expect(200);

      expect(res.body).toHaveProperty('items');
      expect(res.body).toHaveProperty('total');
      expect(res.body.total).toBeGreaterThanOrEqual(1);
      
      const found = list => list.find((p: any) => p.id === createdProjectId);
      expect(found(res.body.items)).toBeDefined();
    });

    it('GET /api/v1/projects/:id (Get Project by ID)', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/projects/${createdProjectId}`)
        .set('x-organization-id', orgId)
        .expect(200);

      expect(res.body.id).toBe(createdProjectId);
      expect(res.body.name).toBe('Sprint 2 Launch');
    });

    it('PUT /api/v1/projects/:id (Update Project)', async () => {
      const res = await request(app.getHttpServer())
        .put(`/api/v1/projects/${createdProjectId}`)
        .set('x-organization-id', orgId)
        .send({
          name: 'Sprint 2 Refined Launch',
          objective: 'Updated objective description',
        })
        .expect(200);

      expect(res.body.id).toBe(createdProjectId);
      expect(res.body.name).toBe('Sprint 2 Refined Launch');
      expect(res.body.objective).toBe('Updated objective description');
    });

    it('POST /api/v1/projects/:id/approve-plan (Approve Project Plan)', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/projects/${createdProjectId}/approve-plan`)
        .set('x-organization-id', orgId)
        .expect(200);

      expect(res.body.id).toBe(createdProjectId);
      expect(res.body.status).toBe('ACTIVE');
    });

    it('DELETE /api/v1/projects/:id (Soft Delete Project)', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/projects/${createdProjectId}`)
        .set('x-organization-id', orgId)
        .expect(200);

      const listRes = await request(app.getHttpServer())
        .get('/api/v1/projects')
        .set('x-organization-id', orgId)
        .expect(200);

      const found = listRes.body.items.find((p: any) => p.id === createdProjectId);
      expect(found).toBeUndefined();
    });
  });

  describe('Task routes (Skeletons)', () => {
    it('POST /api/v1/tasks/:id/approve', () => {
      return request(app.getHttpServer())
        .post('/api/v1/tasks/task_test456/approve')
        .send({
          assignee_id_override: 'emp_dev5',
          estimated_hours_override: 15,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toBe('Task approved successfully');
          expect(res.body.taskId).toBe('task_test456');
          expect(res.body.assignee_id_override).toBe('emp_dev5');
          expect(res.body.estimated_hours_override).toBe(15);
        });
    });
  });

  describe('Analytics routes (Skeletons)', () => {
    it('GET /api/v1/analytics/dashboard', () => {
      return request(app.getHttpServer())
        .get('/api/v1/analytics/dashboard?timeframe=14d5')
        .expect(200)
        .expect((res) => {
          expect(res.body.active_projects).toBe(3);
          expect(res.body.timeframe).toBe('14d5');
        });
    });

    it('GET /api/v1/analytics/team-workload', () => {
      return request(app.getHttpServer())
        .get('/api/v1/analytics/team-workload')
        .expect(200)
        .expect((res) => {
          expect(res.body.workloads).toBeDefined();
        });
    });
  });

  afterAll(async () => {
    await prisma.project.deleteMany({
      where: { organization_id: orgId },
    });
    await prisma.organization.deleteMany({
      where: { id: orgId },
    });
    await app.close();
  });

  afterEach(async () => {
    await app.close();
  });
});
