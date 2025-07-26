import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { title } from 'process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '..', '.env') })

const app = express()
const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || '0.0.0.0'

// Middleware
app.use(helmet())
app.use(morgan('combined'))
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    process.env.CORS_ORIGIN || 'http://localhost:5173'
  ],
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trackdo')
    console.log('✅ Connected to MongoDB')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message)
    process.exit(1)
  }
}

// MongoDB Schemas
const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['Active', 'Completed', 'On Hold', 'Cancelled'], default: 'Active' },
  progress: { type: Number, default: 0 },
  startDate: Date,
  endDate: Date,
  dueDate: Date, // Keep for backward compatibility
  budget: Number,
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  category: { type: String, enum: ['Web Development', 'Mobile App', 'Data Science', 'DevOps', 'Design', 'Marketing', 'Research', 'Development', 'Other'], default: 'Other' },
  teamSize: Number,
  team: [{
    id: Number,
    name: String,
    initials: String,
    color: String,
    role: String
  }],
  teamMembers: [String], // Array of team member names for easier input
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['todo', 'in-progress', 'completed'], default: 'todo' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate: Date,
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  assignee: String,
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  start: { type: String, required: true },
  end: { type: String, required: true },
  allDay: { type: Boolean, default: false },
  type: { type: String, enum: ['meeting', 'work', 'social', 'milestone', 'deadline'], default: 'meeting' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  location: { type: String, default: '' },
  attendees: [String],
  color: { type: String, default: '#1976D2' },
  recurring: {
    enabled: { type: Boolean, default: false },
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'] },
    interval: { type: Number, default: 1 },
    endDate: String
  },
  reminders: [String],
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  status: { type: String, enum: ['confirmed', 'tentative', 'cancelled'], default: 'confirmed' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// Models
const Project = mongoose.model('Project', ProjectSchema)
const Task = mongoose.model('Task', TaskSchema)
const Event = mongoose.model('Event', EventSchema)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'TrackDo API is running',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  })
})

// Projects API
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 })
    res.json(projects)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.post('/api/projects', async (req, res) => {
  try {
    const project = new Project(req.body)
    const savedProject = await project.save()
    res.status(201).json(savedProject)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).json({ message: 'Project not found' })
    res.json(project)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.put('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    )
    if (!project) return res.status(404).json({ message: 'Project not found' })
    res.json(project)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

app.delete('/api/projects/:id', async (req, res) => {
  try {
    const projectId = req.params.id
    console.log('Backend DELETE - received project ID:', projectId)

    if (!projectId || projectId === 'undefined') {
      return res.status(400).json({ message: 'Invalid project ID provided' })
    }

    const project = await Project.findByIdAndDelete(projectId)
    if (!project) return res.status(404).json({ message: 'Project not found' })

    console.log('✅ Project deleted successfully:', project._id)
    res.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('❌ Error deleting project:', error)
    res.status(500).json({ message: error.message })
  }
})

// Tasks API
app.get('/api/tasks', async (req, res) => {
  try {
    const { project, status } = req.query
    let query = {}
    if (project) query.projectId = project
    if (status) query.status = status

    const tasks = await Task.find(query).populate('projectId').sort({ createdAt: -1 })
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.post('/api/tasks', async (req, res) => {
  try {
    const task = new Task(req.body)
    const savedTask = await task.save()
    res.status(201).json(savedTask)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

app.get('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('projectId')
    if (!task) return res.status(404).json({ message: 'Task not found' })
    res.json(task)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    )
    if (!task) return res.status(404).json({ message: 'Task not found' })
    res.json(task)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)
    if (!task) return res.status(404).json({ message: 'Task not found' })
    res.json({ message: 'Task deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Events API
app.get('/api/events', async (req, res) => {
  try {
    const { start, end, project } = req.query
    let query = {}

    if (start && end) {
      query.$or = [
        { start: { $gte: start, $lte: end } },
        { end: { $gte: start, $lte: end } },
        { start: { $lte: start }, end: { $gte: end } }
      ]
    }
    if (project) query.projectId = project

    const events = await Event.find(query).populate('projectId').sort({ start: 1 })
    res.json(events)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.post('/api/events', async (req, res) => {
  try {
    const event = new Event(req.body)
    const savedEvent = await event.save()
    res.status(201).json(savedEvent)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('projectId')
    if (!event) return res.status(404).json({ message: 'Event not found' })
    res.json(event)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.put('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    )
    if (!event) return res.status(404).json({ message: 'Event not found' })
    res.json(event)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

app.delete('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id)
    if (!event) return res.status(404).json({ message: 'Event not found' })
    res.json({ message: 'Event deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Endpoint not found' })
})

// Error handler
app.use((error, req, res, next) => {
  console.error(error.stack)
  res.status(500).json({ message: 'Something went wrong!' })
})

// Start server
const startServer = async () => {
  await connectDB()
  app.listen(PORT, HOST, () => {
    console.log(`🚀 TrackDo API Server running on http://${HOST}:${PORT}`)
    if (HOST === '0.0.0.0') {
      console.log(`🌐 LAN Access available on your network IP:${PORT}`)
      console.log(`📊 Health check: http://[YOUR_IP]:${PORT}/api/health`)
    } else {
      console.log(`📊 Health check: http://${HOST}:${PORT}/api/health`)
    }
  })
}

startServer().catch(console.error)
