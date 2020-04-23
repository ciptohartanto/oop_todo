export default class Model{
  constructor() {
    this.todos = [
      { id: 1, text: 'Marathon', complete: false },
      { id: 2, text: 'Planting', complete: false }
    ]
  }
  
  addTodo(todoText) {
    const newTodo = {
      id: 3,
      text: todoText,
      complete: false
    }
  }
  
}