//! Main app function
function app() {
  //! Model
  const model = (() => {
    //* Todos array
    let _todos = null;

    //* Return array as public API
    return {
      todos: _todos,
    };
  })();

  //! DOM
  const dom = (() => {
    //* Input add element
    const _inputAddElement = document.querySelector("#input-add");
    //* Input add button
    const _addBtnElement = document.querySelector("#btn-submit");
    //* Todo list parent container
    const _todoListElement = document.querySelector("#todo-list");

    //* Generate item HTML markup
    const _generateTodoItem = (item) => {
      return ` 
             <li class="todo-list-item d-flex d-flex-justify-between">
                <div class="d-flex d-flex-align-center gap">
                <div class="todo-input-checked-container">
                <input type="checkbox" class="todo-input-checked" ${
                  item.isDone === true ? "checked" : null
                }/>
                </div>

                <div class="todo-list-item-text-container">
                <p class="todo-list-item-text ${
                  item.isDone ? "text-decoration-line-through" : null
                }">${item.todo}</p>
                </div>
                </div>
                <div class="todo-list-item-delete-container">
                <button class="btn-delete">
                <i class="fa-regular fa-trash-can fa-lg"></i>
                </button>
                </div>
            </li>
        `;
    };

    //* Return DOM elements as public API
    return {
      inputAdd: _inputAddElement,
      btnAdd: _addBtnElement,
      todoList: _todoListElement,
      generateItemHTML: _generateTodoItem,
    };
  })();

  //! App
  ((model, dom) => {
    //* Class constructor
    class TodoItem {
      constructor(todo) {
        this.todo = todo;
        this.isDone = false;
      }
    }

    //! first time load document
    document.addEventListener("DOMContentLoaded", () => {
      //? Check local storage for todos
      if (!localStorage.getItem("todos")) {
        //* Set todos to array
        model.todos = [];
      } else {
        //* Get todos from local storage
        model.todos = JSON.parse(localStorage.getItem("todos"));

        //* Populate DOM with todos element
        model.todos.forEach((item) => {
          //* Generate markup
          const html = dom.generateItemHTML(item);

          //* Insert markup to DOM
          dom.todoList.insertAdjacentHTML("afterbegin", html);
        });
      }
    });

    //! To do item
    dom.todoList.addEventListener("change", (e) => {
      //? Checked if the input is input checked
      if (e.target.classList.contains("todo-input-checked")) {
        //* Find the parent of checked input
        let parent = e.target.closest(".todo-list-item");

        //* Toggle line through style
        const toggleLineDecoration = (status) => {
          //* Get the text content of to do item
          const todoItemText = parent.querySelector(".todo-list-item-text");

          //* Toggle line through style
          todoItemText.classList.toggle("text-decoration-line-through");

          //* Change the isDone property of todo
          model.todos = model.todos.map((item) => {
            return item.todo === todoItemText.textContent
              ? { ...item, isDone: status }
              : item;
          });

          //* Save the todos in local storage
          localStorage.setItem("todos", JSON.stringify(model.todos));
        };

        //? Checked if input is checked
        if (e.target.checked) {
          toggleLineDecoration(true);
        } else {
          toggleLineDecoration(false);
        }
      }
    });

    //! To do item delete
    dom.todoList.addEventListener("click", (e) => {
      //? Checked if the element is trash icon
      if (e.target.classList.contains("fa-trash-can")) {
        //* Traverse up to parent element
        const todoItem = e.target.closest(".todo-list-item");

        //* Find the text content of todo item
        const text = todoItem.querySelector(".todo-list-item-text").textContent;

        //* Remove through filter the todo item
        const newTodos = model.todos.filter((item) => item.todo !== text);

        //* Set todos to model todos
        model.todos = newTodos;

        //* Save todo in local storage
        localStorage.setItem("todos", JSON.stringify(model.todos));

        //* Remove todo element from DOM
        todoItem.remove();
      }
    });

    //! Submit Event
    dom.btnAdd.addEventListener("click", (e) => {
      //* prevent button default
      e.preventDefault();

      //? Checked if input is empty
      if (!dom.inputAdd.value) {
        alert("Input is empty!");
      } else {
        //* Get the input value
        let { value } = dom.inputAdd;

        //* Instantiate a new todo item
        const todoItem = new TodoItem(value);

        //* Push the new todo item to todos
        model.todos.push(todoItem);

        //* Generate HTML markup
        const html = dom.generateItemHTML(todoItem);

        //* Insert to DOM the todo item markup
        dom.todoList.insertAdjacentHTML("afterbegin", html);

        //*  Save to local storage
        localStorage.setItem("todos", JSON.stringify(model.todos));
      }
    });
  })(model, dom);
}

app();
