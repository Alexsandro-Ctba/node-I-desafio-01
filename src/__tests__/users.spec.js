const request = require('supertest');
const { validate } = require('uuid');

const app = require('../');

describe('Users', () => {
  it('Deve ser capaz de criar um novo usuário', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'John Doe',
        username: 'johndoe'
      })
    expect(201);

    expect(validate(response.body.id)).toBe(true);

    expect(response.body).toMatchObject({
      name: 'John Doe',
      username: 'johndoe',
      todos: []
    });
  });

  it('não deve ser capaz de criar um novo usuário quando o nome de usuário já existe', async () => {
    await request(app)
      .post('/users')
      .send({
        name: 'John Doe',
        username: 'johndoe'
      });

    const response = await request(app)
      .post('/users')
      .send({
        name: 'John Doe',
        username: 'johndoe'
      })
      .expect(400);

    expect(response.body.error).toBeTruthy();
  });
});