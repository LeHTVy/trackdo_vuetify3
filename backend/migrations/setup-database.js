/**
 * TrackDo Database Migration Script
 *
 * This script sets up the MongoDB database with initial collections,
 * indexes, and sample data for the TrackDo application.
 *
 * Usage:
 *   node setup-database.js
 *
 * Environment Variables Required:
 *   MONGODB_URI - MongoDB connection string
 */

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '..', '..', '.env') })

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/trackdo'
    await mongoose.connect(mongoUri)
    console.log('✅ Connected to MongoDB:', mongoUri)
    return true
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message)
    return false
  }
}

// Define Schemas (same as in server.js)
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  avatar: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['Active', 'Completed', 'On Hold', 'Cancelled'], default: 'Active' },
  progress: { type: Number, default: 0 },
  startDate: Date,
  endDate: Date,
  budget: Number,
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  category: { type: String, enum: ['Web Development', 'Mobile App', 'Data Science', 'DevOps', 'Design', 'Marketing', 'Research', 'Development', 'Other'], default: 'Other' },
  teamMembers: [String],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['todo', 'in-progress', 'completed'], default: 'todo' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  dueDate: Date,
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  project: String,
  assignee: String,
  tags: [String],
  completed: { type: Boolean, default: false },
  completedAt: Date,
  estimatedHours: { type: Number, default: 0 },
  actualHours: { type: Number, default: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  start: { type: String, required: true },
  end: { type: String, required: true },
  startTime: { type: String, default: '09:00' },
  endTime: { type: String, default: '10:00' },
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
    endDate: String,
  },
  reminders: [String],
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  status: { type: String, enum: ['confirmed', 'tentative', 'cancelled'], default: 'confirmed' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Models
const User = mongoose.model('User', UserSchema)
const Project = mongoose.model('Project', ProjectSchema)
const Task = mongoose.model('Task', TaskSchema)
const Event = mongoose.model('Event', EventSchema)

// Create indexes for better performance
const createIndexes = async () => {
  console.log('📊 Creating database indexes...')

  try {
    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true })
    await User.collection.createIndex({ username: 1 }, { unique: true })

    // Project indexes
    await Project.collection.createIndex({ userId: 1 })
    await Project.collection.createIndex({ status: 1 })
    await Project.collection.createIndex({ priority: 1 })
    await Project.collection.createIndex({ createdAt: -1 })

    // Task indexes
    await Task.collection.createIndex({ userId: 1 })
    await Task.collection.createIndex({ projectId: 1 })
    await Task.collection.createIndex({ status: 1 })
    await Task.collection.createIndex({ priority: 1 })
    await Task.collection.createIndex({ dueDate: 1 })
    await Task.collection.createIndex({ completed: 1 })

    // Event indexes
    await Event.collection.createIndex({ userId: 1 })
    await Event.collection.createIndex({ start: 1 })
    await Event.collection.createIndex({ end: 1 })
    await Event.collection.createIndex({ projectId: 1 })
    await Event.collection.createIndex({ taskId: 1 })

    console.log('✅ Database indexes created successfully')
  } catch (error) {
    console.error('❌ Error creating indexes:', error.message)
  }
}

// Create sample data
const createSampleData = async () => {
  console.log('📝 Creating sample data...')

  try {
    // Check if data already exists
    const userCount = await User.countDocuments()
    if (userCount > 0) {
      console.log('⚠️  Sample data already exists, skipping...')
      return
    }

    // Create sample user
    const sampleUser = new User({
      username: 'demo',
      email: 'demo@trackdo.com',
      password: 'demo123', // In production, this should be hashed
      firstName: 'Demo',
      lastName: 'User',
      role: 'user',
    })

    const savedUser = await sampleUser.save()
    console.log('✅ Sample user created:', savedUser.email)

    // Create sample projects
    const sampleProjects = [
      {
        title: 'TrackDo Web Application',
        description: 'A comprehensive project management and task tracking application built with Vue.js and MongoDB.',
        status: 'Active',
        progress: 75,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        budget: 50000,
        priority: 'High',
        category: 'Web Development',
        teamMembers: ['Demo User', 'John Doe', 'Jane Smith'],
        userId: savedUser._id,
      },
      {
        title: 'Mobile App Development',
        description: 'Cross-platform mobile application for task management on the go.',
        status: 'Active',
        progress: 30,
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-11-30'),
        budget: 30000,
        priority: 'Medium',
        category: 'Mobile App',
        teamMembers: ['Demo User', 'Alice Johnson'],
        userId: savedUser._id,
      },
    ]

    const savedProjects = await Project.insertMany(sampleProjects)
    console.log('✅ Sample projects created:', savedProjects.length)

    // Create sample tasks
    const sampleTasks = [
      {
        title: 'Setup MongoDB Database',
        description: 'Configure MongoDB database with proper schemas and indexes',
        status: 'completed',
        priority: 'high',
        dueDate: new Date('2024-01-15'),
        projectId: savedProjects[0]._id,
        project: savedProjects[0].title,
        assignee: 'Demo User',
        tags: ['database', 'setup'],
        completed: true,
        completedAt: new Date('2024-01-14'),
        estimatedHours: 8,
        actualHours: 6,
        userId: savedUser._id,
      },
      {
        title: 'Implement User Authentication',
        description: 'Add login and registration functionality with JWT tokens',
        status: 'in-progress',
        priority: 'high',
        dueDate: new Date('2024-02-01'),
        projectId: savedProjects[0]._id,
        project: savedProjects[0].title,
        assignee: 'Demo User',
        tags: ['auth', 'security'],
        completed: false,
        estimatedHours: 16,
        actualHours: 10,
        userId: savedUser._id,
      },
      {
        title: 'Design Mobile UI/UX',
        description: 'Create wireframes and mockups for mobile application',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date('2024-07-01'),
        projectId: savedProjects[1]._id,
        project: savedProjects[1].title,
        assignee: 'Alice Johnson',
        tags: ['design', 'ui', 'mobile'],
        completed: false,
        estimatedHours: 24,
        actualHours: 0,
        userId: savedUser._id,
      },
    ]

    const savedTasks = await Task.insertMany(sampleTasks)
    console.log('✅ Sample tasks created:', savedTasks.length)

    // Create sample events
    const sampleEvents = [
      {
        title: 'Project Kickoff Meeting',
        description: 'Initial meeting to discuss project requirements and timeline',
        start: '2024-01-01',
        end: '2024-01-01',
        startTime: '09:00',
        endTime: '10:30',
        allDay: false,
        type: 'meeting',
        priority: 'High',
        location: 'Conference Room A',
        attendees: ['Demo User', 'John Doe', 'Jane Smith'],
        color: '#1976D2',
        projectId: savedProjects[0]._id,
        status: 'confirmed',
        userId: savedUser._id,
      },
      {
        title: 'Database Setup Deadline',
        description: 'Complete MongoDB database configuration',
        start: '2024-01-15',
        end: '2024-01-15',
        allDay: true,
        type: 'deadline',
        priority: 'High',
        color: '#F44336',
        projectId: savedProjects[0]._id,
        taskId: savedTasks[0]._id,
        status: 'confirmed',
        userId: savedUser._id,
      },
    ]

    const savedEvents = await Event.insertMany(sampleEvents)
    console.log('✅ Sample events created:', savedEvents.length)

    console.log('🎉 Sample data creation completed successfully!')

  } catch (error) {
    console.error('❌ Error creating sample data:', error.message)
  }
}

// Main migration function
const runMigration = async () => {
  console.log('🚀 Starting TrackDo Database Migration...')
  console.log('=====================================')

  const connected = await connectDB()
  if (!connected) {
    process.exit(1)
  }

  try {
    await createIndexes()
    await createSampleData()

    console.log('=====================================')
    console.log('✅ Database migration completed successfully!')
    console.log('📊 Database is ready for TrackDo application')
    console.log('')
    console.log('Sample Login Credentials:')
    console.log('  Email: demo@trackdo.com')
    console.log('  Password: demo123')
    console.log('')

  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  } finally {
    await mongoose.connection.close()
    console.log('🔌 Database connection closed')
  }
}

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration()
}

export { runMigration }
