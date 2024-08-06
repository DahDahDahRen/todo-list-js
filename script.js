function app() {
  //! Model
  const model = (() => {
    let _todos = null;

    return {
      todos: _todos,
    };
  })();

  //! DOM
  const dom = (() => {
    const _inputAddElement = document.querySelector("#input-add");
    const _addBtnElement = document.querySelector("#btn-submit");
    const _todoListElement = document.querySelector("#todo-list");

    const _generateTodoItem = (item) => {
      console.log(item);

      return ` 
             <li class="todo-list-item d-flex d-flex-justify-between">
                <div class="d-flex d-flex-align-center gap">
                <div class="todo-input-checked-container">
                <input type="checkbox" class="todo-input-checked" />
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

    return {
      inputAdd: _inputAddElement,
      btnAdd: _addBtnElement,
      todoList: _todoListElement,
      generateItemHTML: _generateTodoItem,
    };
  })();

  //! App
  ((model, dom) => {
    //! Todo item class
    class TodoItem {
      constructor(todo) {
        this.todo = todo;
        this.isDone = false;
      }
    }

    //! first time load document
    document.addEventListener("DOMContentLoaded", () => {
      if (!localStorage.getItem("todos")) {
        model.todos = [];
      } else {
        model.todos = JSON.parse(localStorage.getItem("todos"));

        model.todos.forEach((item) => {
          const html = dom.generateItemHTML(item);

          dom.todoList.insertAdjacentHTML("afterbegin", html);
        });
      }
    });

    //! To do item
    dom.todoList.addEventListener("change", (e) => {
      //* Toggle Checked
      if (e.target.classList.contains("todo-input-checked")) {
        let parent = e.target.closest(".todo-list-item");

        const toggleLineDecoration = () => {
          parent
            .querySelector(".todo-list-item-text")
            .classList.toggle("text-decoration-line-through");
        };

        if (e.target.checked) {
          parent;
          toggleLineDecoration();
        } else {
          parent;
          toggleLineDecoration();
        }
      }
    });

    //! To do item delete
    dom.todoList.addEventListener("click", (e) => {
      if (e.target.classList.contains("fa-trash-can")) {
        const todoItem = e.target.closest(".todo-list-item");

        const text = todoItem.querySelector(".todo-list-item-text").textContent;

        const newTodos = model.todos.filter((todo) => todo !== text);

        model.todos = newTodos;

        localStorage.setItem("todos", JSON.stringify(model.todos));

        todoItem.remove();
      }
    });

    //! Submit Event
    dom.btnAdd.addEventListener("click", (e) => {
      e.preventDefault();

      if (!dom.inputAdd.value) {
        alert("Input is empty!");
      } else {
        let { value } = dom.inputAdd;

        const todoItem = new TodoItem(value);

        model.todos.push(todoItem);

        const html = dom.generateItemHTML(todoItem);

        dom.todoList.insertAdjacentHTML("afterbegin", html);

        // localStorage.setItem("todos", JSON.stringify(model.todos));
      }
    });
  })(model, dom);
}

app();
