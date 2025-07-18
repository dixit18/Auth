import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.user.deleteMany({
    where: {
      email: 'test@example.com'
    }
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Auth API', () => {
  const userData = {
    fullname: 'Test User',
    email: 'test@example.com',
    password: 'Password@123',
    confirmPassword: 'Password@123',
    gender: 'Other',
    mobile: '1234567890',
  };

  it('should create user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send(userData);
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  it('should validate missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ ...userData, email: '' });
    expect(res.status).toBe(400);
  });

  it('should fail for invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ ...userData, email: 'bademail', password: 'Password@123', confirmPassword: 'Password@123' });
    expect(res.status).toBe(400);
  });

  it('should fail for password mismatch', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ ...userData, confirmPassword: 'Different@123' });
    expect(res.status).toBe(400);
  });

  it('should authenticate valid user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: userData.email, password: userData.password });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should fail for wrong credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: userData.email, password: 'WrongPassword@123' });
    expect(res.status).toBe(401);
  });
}); 