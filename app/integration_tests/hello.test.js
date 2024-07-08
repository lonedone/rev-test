const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { sequelize, User } = require('../models');
const helloRoutes = require('../routes/hello');

const app = express();
app.use(bodyParser.json());
app.use('/api', helloRoutes);

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Hello API', () => {
  test('should create a new user', async () => {
    const response = await request(app)
      .put('/api/hello/vladislav')
      .send({ dateOfBirth: '1990-01-01' });
    expect(response.status).toBe(204);
  });

  test('should return happy birtday message if today is the user\'s birthday', async () => {
    const today = new Date().toISOString().split('T')[0];
    await request(app)
      .put('/api/hello/hubbabubba')
      .send({ dateOfBirth: today });

    const response = await request(app).get('/api/hello/hubbabubba');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Hello, hubbabubba! Happy birthday!');
  });

  test('should return birthday in N days message', async () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() - 20);
    futureDate.setDate(futureDate.getDate() + 2);
    const dateString = futureDate.toISOString().split('T')[0];

    await request(app)
      .put('/api/hello/jacob')
      .send({ dateOfBirth: dateString });
    const response = await request(app).get('/api/hello/jacob');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Hello, jacob! Your birthday is in 2 day(s)');
  });

  test('should return 400 response for invalid username', async () => {
    const response = await request(app)
      .put('/api/hello/invalid_user!')
      .send({ dateOfBirth: '1990-01-01' });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Username must contain only letters.');
  });

  test('should return 400 response for invalid date of birth', async () => {
    const response = await request(app)
      .put('/api/hello/daniel')
      .send({ dateOfBirth: '3000-01-01' });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Date of birth must be a valid date before today.');
  });
});
