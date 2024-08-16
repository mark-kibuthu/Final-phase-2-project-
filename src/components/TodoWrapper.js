import React, { useState, useEffect } from "react";
import { Todo } from "./Todo";
import { TodoForm } from "./TodoForm";
import { v4 as uuidv4 } from "uuid";
import { EditTodoForm } from "./EditTodoForm";
import './TodoWrapper.css';

export const TodoWrapper = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/todos")
      .then(response => response.json())
      .then(data => setTodos(data))
      .catch(error => console.error("Error fetching todos:", error));
  }, []);

  const addTodo = (todo) => {
    const newTodo = { id: uuidv4(), task: todo, completed: false, isEditing: false };
    
    fetch("http://localhost:3000/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTodo),
    })
      .then(response => response.json())
      .then(data => setTodos([...todos, data]))
      .catch(error => console.error("Error adding todo:", error));
  };

  const deleteTodo = (id) => {
    fetch(`http://localhost:3000/todos/${id}`, {
      method: "DELETE",
    })
      .then(() => setTodos(todos.filter((todo) => todo.id !== id)))
      .catch(error => console.error("Error deleting todo:", error));
  };

  const toggleComplete = (id) => {
    const todo = todos.find((todo) => todo.id === id);
    const updatedTodo = { ...todo, completed: !todo.completed };

    fetch(`http://localhost:3000/todos/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTodo),
    })
      .then(response => response.json())
      .then(data => setTodos(todos.map((todo) => (todo.id === id ? data : todo))))
      .catch(error => console.error("Error toggling completion:", error));
  };

  const editTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
      )
    );
  };

  const editTask = (task, id) => {
    const updatedTodo = { ...todos.find((todo) => todo.id === id), task, isEditing: false };

    fetch(`http://localhost:3000/todos/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTodo),
    })
      .then(response => response.json())
      .then(data => setTodos(todos.map((todo) => (todo.id === id ? data : todo))))
      .catch(error => console.error("Error editing task:", error));
  };

  return (
    <div className="todo-wrapper">
      <h1>Get Things Done!</h1>
      <TodoForm addTodo={addTodo} />
      {todos.map((todo) =>
        todo.isEditing ? (
          <EditTodoForm editTodo={editTask} task={todo} key={todo.id} />
        ) : (
          <Todo
            key={todo.id}
            task={todo}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
            toggleComplete={toggleComplete}
          />
        )
      )}
    </div>
  );
};
