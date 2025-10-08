import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Todos E2E', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /todos should return []', async () => {
    await request(app.getHttpServer()).get('/todos').expect(200).expect([]);
  });

  it('POST /todos should validate title', async () => {
    await request(app.getHttpServer()).post('/todos').send({ title: '' }).expect(400);
  });

  it('CRUD flow works', async () => {
    // Create
    const createRes = await request(app.getHttpServer())
      .post('/todos')
      .send({ title: 'Task', description: 'desc' })
      .expect(201);
    const todo = createRes.body as { id: number; title: string; description?: string; completed: boolean };
    expect(todo).toEqual(
      expect.objectContaining({ id: expect.any(Number), title: 'Task', description: 'desc', completed: false }),
    );

    // Read all
    const getAll = await request(app.getHttpServer()).get('/todos').expect(200);
    expect(getAll.body).toEqual([expect.objectContaining({ id: todo.id })]);

    // Update
    const updateRes = await request(app.getHttpServer())
      .put(`/todos/${todo.id}`)
      .send({ title: 'Task updated', completed: true })
      .expect(200);
    expect(updateRes.body).toEqual(expect.objectContaining({ id: todo.id, title: 'Task updated', completed: true }));

    // Delete
    await request(app.getHttpServer()).delete(`/todos/${todo.id}`).expect(204);

    // Verify not found
    await request(app.getHttpServer()).get(`/todos/${todo.id}`).expect(404);
  });
});
