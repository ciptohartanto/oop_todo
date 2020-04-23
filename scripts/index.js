// import Model from './model/model.js'

class Model{
  constructor() {
    this.todos = [
      { id: 1, text: 'Marathon', complete: false },
      { id: 2, text: 'Gardening', complete: false }
    ]
  }
  
  // bindTodosData(callback){
  //   this.updateTodo = callback
  // }
  addTodo(todoText, isComplete=false) {
    const genID = () => {
      if(this.todos.length > 0 ) {
        return this.todos.length + 1
      }
    }
    const newTodo = {
      id: genID(),
      text: todoText,
      complete: isComplete
    }
    this.todos.push(newTodo)
  }
  deleteTodo(id) {
    this.todos = this.todos.filter(todo => todo.id !== id)
  }
  
  editTodo(id, todoText) {
    this.todos = this.todos.map(todo => todo.id === id ? {
      id: todo.id,
      text: todoText,
      complete: todo.complete
    } : todo)
  }
  toggleTodo(id) {
    this.todos = this.todos.map(todo => todo.id === id ? {
      id: todo.id,
      text: todo.text,
      complete: !todo.complete
    } : todo)
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
    this.todoItem = this.createElement('li', 'todo-item');
    this.todoItemInput = this.createElement('input', 'todo-itemInput');
    this.todoItemInput.id = 0;
    this.todoItemInput.type = 'text'

    this.todoItemX = this.createElement('span', 'todo-x');
    this.todo.append(this.title, this.subtitle1, this.newInput, this.subtitle2);
    this.app.append(this.todo);
    
    this.newTodo = ''
    this._init_listenNewInput()
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
  _init_listenNewInput() {
    this.newInput.addEventListener('keyup', (e) => {
      if(e.which === 13) {
        this.newTodo = this._newInputValue
        if(this._newInputValue.trim().length === 0) {
          this.newInput.placeholder = 'Ketik anu baleg, beul!'
          this._resetInput()
        }
      }
    })
  }
  displayTodos(todos) {
    if(todos.length !== 0) {
      const markup = new Array()
      todos.forEach(todo => {
        this.todoItemInput.value = todo.text;
        this.todoItemInput.id = todo.id;
        this.todoItem.append(this.todoItemInput, this.todoItemX);
        markup.push(this.todoItem)
        console.log(todo.id)
      });
      this.todoList.innerHTML = markup.map(item => item.outerHTML).join('');
      this.todo.append(this.todoList);
      console.log(markup)
    }

  }
}

class Controller {
  constructor(){
    this.model = new Model();
    this.view = new View();
    // this.model.bindTodosData(this.updateTodo)
    this.updateTodo(this.model.todos) // inject the initial todos
    this.x = this.model.todos
  }
  updateTodo = todos => {
    this.view.displayTodos(todos)
  }
}

const todo = new Controller()