// import Model from './model/model.js'


class Model{
  constructor() {
    this.todos = JSON.parse(localStorage.getItem('todos')) || []
  }
  addTodo(todoText, isComplete=false) {
    const genID = () => {
      if(this.todos.length >= 0 ) {
        return this.todos.length + 1
      }
    }
    const newTodo = {
      id: genID(),
      text: todoText,
      complete: isComplete
    }
    this.todos.push(newTodo)
    this._commit(this.todos)
  }
  deleteTodo(id) {
    this.todos = this.todos.filter(todo => todo.id !== id)
    this._commit(this.todos)
  }

  editTodo(id, todoText) {
    this.todos = this.todos.map(todo => todo.id === id ? {
      id: todo.id,
      text: todoText,
      complete: todo.complete
    } : todo)
    this._commit(this.todos)
    console.log('editted to: ' + todoText)
  }
  toggleTodo(id) {
    this.todos = this.todos.map(todo => todo.id === id ? {
      id: todo.id,
      text: todo.text,
      complete: !todo.complete
    } : todo)
  }
  bindTodosOnChange(callback) {
    /* don't get confused:
    1. this.updateTodo is a prop of model
    2. the value is set to the callback === controller.updateTodo
    */
    this.updateTodo = callback
  }
  _commit(todos){
    this.updateTodo(todos) // now we can pass todo as an argument to this.updateTodo
    localStorage.setItem('todos', JSON.stringify(todos))
  }
}

class View{
  constructor() {
    this.app = this.getElement('#app');
    this.todo = this.createElement('div', 'todo');
    this.title = this.createElement('h1', 'todo-title');
    this.title.innerHTML = 'The Karadjo';
    this.subtitle1 = this.createElement('h2', 'todo-subtitle1');
    this.subtitle1.innerHTML = 'Tambahkan Karadjo';
    this.newInput = this.createElement('input', 'todo-newInput');
    this.newInput.type = 'text'
    this.newInput.placeholder = 'Tambah Karadjo';
    this.subtitle2 = this.createElement('h2', 'todo-subtitle2');
    this.subtitle2.innerHTML = 'Daftar Karadjo';
    this.todoList = this.createElement('ul', 'todo-list');



    // this.editTodoText
    this.newTodo = '';
  }
  createElement(tag,className) {
    const elem = document.createElement(tag)
    if (className) elem.classList.add(className)
    return elem
  }
  getElement(sel) {
    const elem = document.querySelector(sel)
    return elem
  }
  get _newInputValue() {
    return this.newInput.value
  }
  _resetInput() {
    this.newInput.value = ''
  }
  _attachClick() {
    this.itemInputs = document.querySelectorAll('.todo-itemInput')
  }
  createSkeleton(){
    this.todo.append(this.title, this.subtitle1, this.newInput, this.subtitle2, this.todoList);
    this.app.append(this.todo);
  }
  displayTodos(todos) {
      const markup = new Array()

      if (todos.length === 0) {
        const markup_noTodos = `
          <p>No Todos! :)</p>
        `
        markup.push(markup_noTodos)
      } else {
        todos.forEach(todo => {
          const markup_todoList = `
            <li class="todo-item">
              <input class="todo-itemInput" type="text" id="${todo.id}" value="${todo.text}" />
              <span class="todo-x">x</span>
            </li>
          `
          markup.push(markup_todoList)
        });
      }
      this.todoList.innerHTML = markup.map(item => item).join('');

  }
  newTodoText(handler, todos) {
    this.newInput.addEventListener('keyup', (e) => {
      e.preventDefault()
      this.newTodo = this.newInput.value;

      if( e.which === 13) {
        if(this.newInput.value.trim().length !== 0) {
          handler(this.newTodo); // this handler takes care of
          this.newInput.placeholder = 'Tambah Karadjo';
          this._resetInput(); // resets the this.newInput.value
        } else if (this.newInput.value.trim().length === 0 && this.newTodo !== '') {
          this._resetInput(); // resets the this.newInput.value
          this.newTodo = '';
          this.newInput.placeholder = 'Ulangi lagi!';
        }

      }
    })
  }
  editTodoText(handler) {
    document.querySelectorAll('.todo-itemInput').forEach(item => {
      item.addEventListener('keyup', (e) => {
        e.preventDefault()
        if(e.which === 13) {
          if(item.value.trim().length === 0) {
            item.placeholder = 'Ketik anu baleg, beul!';
            item.value=''
          } else {
            handler(Number(item.id), item.value.toString());
          }
        }
      })
    })
  }
  deleteTodoText(handler) {
    document.querySelectorAll('.todo-itemInput').forEach(item => {
      item.parentElement.children[1].addEventListener('click', (e)=>{
        e.preventDefault();
        handler(Number(item.id));
      })
    })
  }
}

class Controller {
  constructor(){
    this.model = new Model();
    this.view = new View();
    this.view.createSkeleton(); // create the basic markup for this project
    this.updateTodo(this.model.todos); // inject the initial todos
    this.model.bindTodosOnChange(this.updateTodo); // connecting view and model to update the model.todos
  }
  updateTodo = todos => {
    this.view.displayTodos(todos);
    this.view.newTodoText(this.handleNewTodo, this.model.todos);
    this.view.editTodoText(this.handleEditingTodo, this.model.todos);
    this.view.deleteTodoText(this.handleDeleteTodo);
  }
  handleNewTodo = todoText => {
    this.model.addTodo(todoText);
  }
  handleEditingTodo = (id, todoText) => {
    this.model.editTodo(id, todoText);
    // console.log(this.model.todos[id-1].text) //debugging
  }
  handleDeleteTodo = (id) => {
    this.model.deleteTodo(id);
  }
}

const todo = new Controller()