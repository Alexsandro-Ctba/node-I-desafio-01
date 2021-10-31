const request = require('supertest');
const { validate } = require('uuid');

const app = require('../');

describe('Todos', () => {
  it("deve ser capaz de listar todas as tarefas do usuário", async () => {
    const userResponse = await request(app)
      .post('/users')
      .send({
        name: 'John Doe',
        username: 'user1'
      });

    const todoDate = new Date();

    const todoResponse = await request(app)
      .post('/todos')
      .send({
        title: 'test todo',
        deadline: todoDate
      })
      .set('username', userResponse.body.username);

    const response = await request(app)
      .get('/todos')
      .set('username', userResponse.body.username);

    expect(response.body).toEqual(
      expect.arrayContaining([
        todoResponse.body
      ]),
    )
  });

  it('deve ser capaz de criar uma nova tarefa', async () => {
    const userResponse = await request(app)
      .post('/users')
      .send({
        name: 'John Doe',
        username: 'user2'
      });

    const todoDate = new Date();

    const response = await request(app)
      .post('/todos')
      .send({
        title: 'test todo',
        deadline: todoDate
      })
      .set('username', userResponse.body.username)
      .expect(201);

    expect(response.body).toMatchObject({
      title: 'test todo',
      deadline: todoDate.toISOString(),
      done: false
    });
    expect(validate(response.body.id)).toBe(true);
    expect(response.body.created_at).toBeTruthy();
  });

  it('deve ser capaz de atualizar um todo', async () => {
    const userResponse = await request(app)
      .post('/users')
      .send({
        name: 'John Doe',
        username: 'user7'
      });

    const todoDate = new Date();

    const todoResponse = await request(app)
      .post('/todos')
      .send({
        title: 'test todo',
        deadline: todoDate
      })
      .set('username', userResponse.body.username);

    const response = await request(app)
      .put(`/todos/${todoResponse.body.id}`)
      .send({
        title: 'update title',
        deadline: todoDate
      })
      .set('username', userResponse.body.username);

    expect(response.body).toMatchObject({
      title: 'update title',
      deadline: todoDate.toISOString(),
      done: false
    });
  });

  it('não deve ser capaz de atualizar uma tarefa não existente', async () => {
    const userResponse = await request(app)
      .post('/users')
      .send({
        name: 'John Doe',
        username: 'user8'
      });

    const todoDate = new Date();

    const response = await request(app)
      .put('/todos/invalid-todo-id')
      .send({
        title: 'update title',
        deadline: todoDate
      })
      .set('username', userResponse.body.username)
      .expect(404);

    expect(response.body.error).toBeTruthy();
  });

  it('deve ser capaz de marcar uma tarefa como concluída', async () => {
    const userResponse = await request(app)
      .post('/users')
      .send({
        name: 'John Doe',
        username: 'user3'
      });

    const todoDate = new Date();

    const todoResponse = await request(app)
      .post('/todos')
      .send({
        title: 'test todo',
        deadline: todoDate
      })
      .set('username', userResponse.body.username);

    const response = await request(app)
      .patch(`/todos/${todoResponse.body.id}/done`)
      .set('username', userResponse.body.username);

    expect(response.body).toMatchObject({
      ...todoResponse.body,
      done: true
    });
  });

  it('não deve ser capaz de marcar uma tarefa inexistente como concluída', async () => {
    const userResponse = await request(app)
      .post('/users')
      .send({
        name: 'John Doe',
        username: 'user4'
      });

    const response = await request(app)
      .patch('/todos/invalid-todo-id/done')
      .set('username', userResponse.body.username)
      .expect(404);

    expect(response.body.error).toBeTruthy();
  });

  it('deve ser capaz de excluir um todo', async () => {
    const userResponse = await request(app)
      .post('/users')
      .send({
        name: 'John Doe',
        username: 'user5'
      });

    const todoDate = new Date();

    const todo1Response = await request(app)
      .post('/todos')
      .send({
        title: 'test todo',
        deadline: todoDate
      })
      .set('username', userResponse.body.username);

    await request(app)
      .delete(`/todos/${todo1Response.body.id}`)
      .set('username', userResponse.body.username)
      .expect(204);

    const listResponse = await request(app)
      .get('/todos')
      .set('username', userResponse.body.username);

    expect(listResponse.body).toEqual([]);
  });

  it('não deve ser capaz de excluir uma tarefa não existente', async () => {
    const userResponse = await request(app)
      .post('/users')
      .send({
        name: 'John Doe',
        username: 'user6'
      });

    const response = await request(app)
      .delete('/todos/invalid-todo-id')
      .set('username', userResponse.body.username)
      .expect(404);

    expect(response.body.error).toBeTruthy();
  });
});