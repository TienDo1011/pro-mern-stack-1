import request from 'supertest';
import app from '../app';

const user1 = request.agent(app);

describe('Login', () => {
  test('should give the user info', async () => {
    const response = await request(app)
      .post('/signin')
      .send({
        username: 'barney',
        password: 'barney',
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      user: 'barney',
      password: 'barney',
    });
  });
});

describe('access data without login', () => {
  test('can get issue', async () => {
    const issues = await request(app).get('/api/issues');
    expect(issues.body.records.length).toBeGreaterThan(0);
  });
});

describe('Access protected data after login', () => {
  test('login', async () => {
    await user1.post('/signin').send({
      username: 'barney',
      password: 'barney',
    });
  });

  test('is signed in', async () => {
    const response = await user1.get('/api/users/me');
    expect(response.body).toMatchObject({
      user: 'barney',
      password: 'barney',
    });
  });
});
