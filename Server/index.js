const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/todolist")
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err))

// Todo Schema
const todoSchema = new mongoose.Schema({
  task: String,
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  category: { type: String, default: 'Personal' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate: { type: Date, default: null }
})

const Todo = mongoose.model('Todo', todoSchema)

// Routes
app.post('/add', async (req, res) => {
  try {
    const { task, category, priority, dueDate } = req.body
    const newTodo = new Todo({ 
      task, 
      category: category || 'Personal',
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : null
    })
    await newTodo.save()
    res.status(201).json(newTodo)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/todos', async (req, res) => {
  try {
    const { filter, search, sort } = req.query
    let query = {}
    
    // Apply filters
    if (filter === 'active') {
      query.completed = false
    } else if (filter === 'completed') {
      query.completed = true
    }
    
    // Apply search
    if (search) {
      query.task = { $regex: search, $options: 'i' }
    }
    
    // Apply sorting
    let sortOption = { createdAt: -1 }
    if (sort === 'priority') {
      sortOption = { priority: 1, createdAt: -1 }
    } else if (sort === 'dueDate') {
      sortOption = { dueDate: 1, createdAt: -1 }
    }
    
    const todos = await Todo.find(query).sort(sortOption)
    res.json(todos)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put('/todo/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { completed, task, category, priority, dueDate } = req.body
    
    const updateData = {}
    if (completed !== undefined) updateData.completed = completed
    if (task) updateData.task = task
    if (category) updateData.category = category
    if (priority) updateData.priority = priority
    if (dueDate) updateData.dueDate = new Date(dueDate)
    
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )
    res.json(updatedTodo)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/todo/:id', async (req, res) => {
  try {
    const { id } = req.params
    await Todo.findByIdAndDelete(id)
    res.json({ message: 'Todo deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/categories', async (req, res) => {
  try {
    const categories = await Todo.distinct('category')
    res.json(categories)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/stats', async (req, res) => {
  try {
    const total = await Todo.countDocuments()
    const completed = await Todo.countDocuments({ completed: true })
    const active = await Todo.countDocuments({ completed: false })
    const highPriority = await Todo.countDocuments({ priority: 'high', completed: false })
    
    res.json({
      total,
      completed,
      active,
      highPriority
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(3001, () => {
  console.log("Server is Running on port 3001")
})