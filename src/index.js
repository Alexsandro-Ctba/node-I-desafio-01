const express = require('express');
const cors = require('cors');

 const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

 const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers

  const userAlreadExists = users.find((user) =>user.username === username)

  if(!userAlreadExists){
    return response.status(404).json({error:"Acesso negado! Usuário não tem permissão."})
  }

  request.username = userAlreadExists;

  next();

}

app.post('/users', (request, response) => {
  // Complete aqui
  const {name, username} = request.body

  const userAlreadExists = users.find((user)=>user.username === username);

  if(userAlreadExists){
    return response.status(400).json({error: 'Usuário já existe, verifique e tente novamente!'})
  }

  const user ={
    id:uuidv4(),
    name:name,
    username:username,
    todos:[]
  }

  users.push(user)

  return response.status(201).json(user)

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { username } = request
 
  return response.json(username.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline }=request.body
  const { username}= request

const todo = {
  id:uuidv4(),
     title:title,
     done:false,
     deadline:new Date(deadline),
     created_at:new Date()
}  

username.todos.push(todo)


return response.status(201).json(todo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { username } = request
  const {title, deadline}= request.body
  const { id } = request.params

  const validTodo = username.todos.some((todo)=>todo.id === id)

  if(!validTodo){
    return response.status(404).json({error:"Não é possível atualizar tarefas inexistentes!"})
  }
  
  username.todos.filter((todo)=>{
   if(todo.id === id){
     todo.title = title;
     todo.deadline = new Date(deadline);
   }
 })
const [ todos ] = username.todos
 console.log(todos)


 return response.json(todos)

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { username } = request
  const { id } = request.params;

  const doneAlreadExists = username.todos.some((todo)=>todo.id === id)

  if(!doneAlreadExists){
    return response.status(404).json({error:"Tarefa não existe es"})
  }

  username.todos.filter((todo)=>{
    if(todo.id === id){
      todo.done = true
    }
  })

  const [ todos ] = username.todos
  return response.json(todos)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
const { id }=request.params
  const { username }=request
  
  const todo = username.todos.filter((todo)=> todo.id === id)
  if(todo.length ===0){
    return response.status(404).json({error:"tarefa não existe!"})
  }

  username.todos.filter((todo) =>{
    if(todo.id === id){
      username.todos.splice(todo,1)
    }
  })

  return response.status(204).json(username)
});

module.exports = app;