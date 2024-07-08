const axios = require('axios');
const moment = require('moment');

const API_URL = process.env.API_URL;

describe('Hello API System Tests', () => {
  test('should create a new user', async () => {
    const response = await axios.put(`${API_URL}/hello/vladislav`, { dateOfBirth: '1990-01-01' });
    expect(response.status).toBe(204);
  });

  test('should return happy birtday message if today is the user\'s birthday', async () => {
    const today = moment().format('YYYY-MM-DD');
    await axios.put(`${API_URL}/hello/hubbabubba`, { dateOfBirth: today });
    const response = await axios.get(`${API_URL}/hello/hubbabubba`);
    expect(response.status).toBe(200);
    expect(response.data.message).toBe('Hello, hubbabubba! Happy birthday!');
  });

  test('should return birthday in N days message', async () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() - 20);
    futureDate.setDate(futureDate.getDate() + 2);
    const dateString = futureDate.toISOString().split('T')[0];

    await axios.put(`${API_URL}/hello/jacob`, { dateOfBirth: dateString });
    const response = await axios.get(`${API_URL}/hello/jacob`);
    expect(response.status).toBe(200);
    expect(response.data.message).toBe('Hello, jacob! Your birthday is in 2 day(s)');
  });

  test('should return 400 response for invalid username', async () => {
    try {
      await axios.put(`${API_URL}/hello/invalid_user!`, { dateOfBirth: '1990-01-01' });
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data.error).toBe('Username must contain only letters.');
    }
  });

  test('should return 400 response for invalid date of birth', async () => {
    try {
      await axios.put(`${API_URL}/hello/daniel`, { dateOfBirth: '3000-01-01' });
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data.error).toBe('Date of birth must be a valid date before today.');
    }
  });
});