import { useState, useEffect, useContext } from 'react'
import './Home.css'
import { ThemeContext } from './ThemeContext'

function Home() {
  const [todos, setTodos] = useState([])
  const [newTask, setNewTask] = useState('')
  const [newCategory, setNewCategory] = useState('Personal')
  const [newPriority, setNewPriority] = useState('medium')
  const [newDueDate, setNewDueDate] = useState('')
  const [categories, setCategories] = useState([])
  const [stats, setStats] = useState({ total: 0, completed: 0, active: 0, highPriority: 0 })
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('created')
  const [editingTodo, setEditingTodo] = useState(null)
  const { isDarkMode, toggleTheme } = useContext(ThemeContext)

  useEffect(() => {
    fetchTodos()
    fetchCategories()
    fetchStats()
  }, [filter, search, sort])

  const fetchTodos = async () => {
    try {
      const response = await fetch(`http://localhost:3001/todos?filter=${filter}&search=${search}&sort=${sort}`)
      const data = await response.json()
      setTodos(data)
    } catch (error) {
      console.error('Error fetching todos:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:3001/categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3001/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const addTodo = async (e) => {
    e.preventDefault()
    if (!newTask.trim()) return

    try {
      const response = await fetch('http://localhost:3001/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          task: newTask,
          category: newCategory,
          priority: newPriority,
          dueDate: newDueDate || null
        }),
      })
      const data = await response.json()
      setTodos([data, ...todos])
      setNewTask('')
      setNewCategory('Personal')
      setNewPriority('medium')
      setNewDueDate('')
      fetchCategories()
      fetchStats()
    } catch (error) {
      console.error('Error adding todo:', error)
    }
  }

  const toggleComplete = async (id, completed) => {
    try {
      const response = await fetch(`http://localhost:3001/todo/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !completed }),
      })
      const updatedTodo = await response.json()
      setTodos(todos.map(todo => 
        todo._id === id ? updatedTodo : todo
      ))
      fetchStats()
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  const deleteTodo = async (id) => {
    try {
      await fetch(`http://localhost:3001/todo/${id}`, {
        method: 'DELETE',
      })
      setTodos(todos.filter(todo => todo._id !== id))
      fetchCategories()
      fetchStats()
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  const startEditing = (todo) => {
    setEditingTodo(todo)
    setNewTask(todo.task)
    setNewCategory(todo.category)
    setNewPriority(todo.priority)
    setNewDueDate(todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '')
  }

  const saveEdit = async () => {
    if (!editingTodo) return

    try {
      const response = await fetch(`http://localhost:3001/todo/${editingTodo._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          task: newTask,
          category: newCategory,
          priority: newPriority,
          dueDate: newDueDate || null
        }),
      })
      const updatedTodo = await response.json()
      setTodos(todos.map(todo => 
        todo._id === editingTodo._id ? updatedTodo : todo
      ))
      setEditingTodo(null)
      setNewTask('')
      setNewCategory('Personal')
      setNewPriority('medium')
      setNewDueDate('')
      fetchCategories()
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  const cancelEdit = () => {
    setEditingTodo(null)
    setNewTask('')
    setNewCategory('Personal')
    setNewPriority('medium')
    setNewDueDate('')
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Todo List</h1>
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>
      
      <div className="stats-container">
        <div className="stat-item">
          <span className="stat-label">Total:</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Active:</span>
          <span className="stat-value">{stats.active}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Completed:</span>
          <span className="stat-value">{stats.completed}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">High Priority:</span>
          <span className="stat-value">{stats.highPriority}</span>
        </div>
      </div>
      
      <div className="filters-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-buttons">
          <button 
            className={filter === 'all' ? 'filter-button active' : 'filter-button'}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={filter === 'active' ? 'filter-button active' : 'filter-button'}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button 
            className={filter === 'completed' ? 'filter-button active' : 'filter-button'}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
        
        <div className="sort-container">
          <select 
            value={sort} 
            onChange={(e) => setSort(e.target.value)}
            className="sort-select"
          >
            <option value="created">Created Date</option>
            <option value="priority">Priority</option>
            <option value="dueDate">Due Date</option>
          </select>
        </div>
      </div>
      
      <form onSubmit={editingTodo ? saveEdit : addTodo} className="todo-form">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder={editingTodo ? "Edit task..." : "Add a new task..."}
          className="todo-input"
        />
        
        <select
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="category-select"
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
          <option value="new">+ Add New Category</option>
        </select>
        
        {newCategory === 'new' && (
          <input
            type="text"
            placeholder="New category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="category-input"
          />
        )}
        
        <select
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value)}
          className="priority-select"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        
        <input
          type="date"
          value={newDueDate}
          onChange={(e) => setNewDueDate(e.target.value)}
          className="date-input"
        />
        
        <button type="submit" className="add-button">
          {editingTodo ? 'Save' : 'Add'}
        </button>
        
        {editingTodo && (
          <button type="button" onClick={cancelEdit} className="cancel-button">
            Cancel
          </button>
        )}
      </form>
      
      {todos.length === 0 ? (
        <div className="empty-state">
          {search ? 'No tasks match your search' : 'No tasks yet. Add one above!'}
        </div>
      ) : (
        <ul className="todo-list">
          {todos.map(todo => (
            <li key={todo._id} className="todo-item">
              <div className={`todo-priority priority-${todo.priority}`}></div>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(todo._id, todo.completed)}
                className="todo-checkbox"
              />
              <div className="todo-content">
                <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                  {todo.task}
                </span>
                <div className="todo-meta">
                  <span className="todo-category">{todo.category}</span>
                  {todo.dueDate && (
                    <span className="todo-date">Due: {formatDate(todo.dueDate)}</span>
                  )}
                </div>
              </div>
              <div className="todo-actions">
                <button
                  onClick={() => startEditing(todo)}
                  className="edit-button"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTodo(todo._id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Home