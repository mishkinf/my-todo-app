import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [animatingItems, setAnimatingItems] = useState(new Set());
  const [deletingItems, setDeletingItems] = useState(new Set());

  const addTodo = () => {
    if (inputValue.trim() !== '') {
      const newTodo = {
        id: Date.now(),
        text: inputValue,
        completed: false
      };
      setTodos([...todos, newTodo]);
      setAnimatingItems(new Set([...animatingItems, newTodo.id]));
      setInputValue('');
      
      // Remove animation class after animation completes
      setTimeout(() => {
        setAnimatingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(newTodo.id);
          return newSet;
        });
      }, 300);
    }
  };

  const deleteTodo = (id) => {
    setDeletingItems(new Set([...deletingItems, id]));
    
    // Remove from todos after animation completes
    setTimeout(() => {
      setTodos(todos.filter(todo => todo.id !== id));
      setDeletingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 300);
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const filteredTodos = todos.filter(todo =>
    todo.text.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="app">
      <h1>My Todo App</h1>
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter a new todo..."
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <div className="search-container">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search todos..."
        />
      </div>
      <ul className="todo-list">
        {filteredTodos.map(todo => {
          const isAnimating = animatingItems.has(todo.id);
          const isDeleting = deletingItems.has(todo.id);
          
          return (
            <li 
              key={todo.id} 
              className={`todo-item ${todo.completed ? 'completed' : ''} ${isAnimating ? 'todo-item-enter' : ''} ${isDeleting ? 'todo-item-exit' : ''}`}
            >
              <span onClick={() => toggleComplete(todo.id)}>{todo.text}</span>
              <button onClick={() => deleteTodo(todo.id)}>Delete</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;