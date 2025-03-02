import React from 'react';
import Todo from './ToDo';

const ToDoWidget = ({ todos = [], handleTodoToggle, onConvertToTask }) => {
  console.log('ToDoWidget props:', { todos, handleTodoToggle, onConvertToTask }); // Debug log

  return (
    <div className="todo-widget">
      {todos.map((todo) => (
        <Todo
          key={todo.id}
          todo={todo}
          handleTodoToggle={handleTodoToggle}
          onConvertToTask={onConvertToTask}
        />
      ))}
    </div>
  );
};

export default ToDoWidget; 