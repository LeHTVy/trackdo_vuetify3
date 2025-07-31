# TrackDo MongoDB Setup & Backend Documentation

## Overview

TrackDo is a comprehensive project management and task tracking application built with Vue.js frontend and Node.js/Express backend, using MongoDB as the primary database. This document provides detailed setup instructions for the MongoDB database and backend infrastructure.

## Architecture

- **Frontend**: Vue.js 3 with Vuetify (Port 5173)
- **Backend**: Node.js with Express.js (Port 3000)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Basic token-based authentication system (Note: JWT implementation pending)

## Prerequisites

Before setting up the database, ensure you have:

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher) - Local installation or MongoDB Atlas
- npm or yarn package manager

## Quick Setup (Migration Script)

### 1. Database Migration Script

We provide a comprehensive migration script that sets up the entire database with proper schemas, indexes, and sample data.

**Location**: `backend/migrations/setup-database.js`

**To run the migration:**

```bash
# Navigate to the project root
cd trackdo

# Install dependencies
npm install

# Set up environment variables (see Environment Configuration below)
cp .env.example .env

# Run the migration script
node backend/migrations/setup-database.js
```

The migration script will:
- Connect to MongoDB using your environment configuration
- Create all required collections with proper schemas
- Set up database indexes for optimal performance
- Insert sample data for testing
- Provide sample login credentials

### 2. Environment Configuration

Create a `.env` file in the project root with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/trackdo

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```


## Backend Architecture

### 1. Server Configuration

**File**: `backend/server.js`

The backend server includes:
- Express.js application with security middleware (Helmet, CORS)
- MongoDB connection with Mongoose ODM
- Comprehensive API endpoints for all entities
- Error handling and logging
- Health check endpoint

**Key Dependencies:**
```json
{
  "express": "^4.18.2",
  "mongoose": "^7.5.0",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "helmet": "^7.0.0",
  "morgan": "^1.10.0"
}
```

### 2. Database Schemas

#### User Schema
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required),
  firstName: String (required),
  lastName: String (required),
  avatar: String,
  role: String (enum: ['user', 'admin']),
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### Project Schema
```javascript
{
  title: String (required),
  description: String,
  status: String (enum: ['Active', 'Completed', 'On Hold', 'Cancelled']),
  progress: Number (0-100),
  startDate: Date,
  endDate: Date,
  budget: Number,
  priority: String (enum: ['Low', 'Medium', 'High', 'Critical']),
  category: String (enum: ['Web Development', 'Mobile App', 'Data Science', 'DevOps', 'Design', 'Marketing', 'Research', 'Development', 'Other']),
  teamMembers: [String],
  userId: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

#### Task Schema
```javascript
{
  title: String (required),
  description: String,
  status: String (enum: ['todo', 'in-progress', 'completed']),
  priority: String (enum: ['low', 'medium', 'high', 'critical']),
  dueDate: Date,
  projectId: ObjectId (ref: 'Project'),
  project: String,
  assignee: String,
  tags: [String],
  completed: Boolean,
  completedAt: Date,
  estimatedHours: Number,
  actualHours: Number,
  userId: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

#### Event Schema
```javascript
{
  title: String (required),
  description: String,
  start: String (required),
  end: String (required),
  startTime: String,
  endTime: String,
  allDay: Boolean,
  type: String (enum: ['meeting', 'work', 'social', 'milestone', 'deadline']),
  priority: String (enum: ['Low', 'Medium', 'High']),
  location: String,
  attendees: [String],
  color: String,
  recurring: {
    enabled: Boolean,
    frequency: String,
    interval: Number,
    endDate: String
  },
  reminders: [String],
  projectId: ObjectId (ref: 'Project'),
  taskId: ObjectId (ref: 'Task'),
  status: String (enum: ['confirmed', 'tentative', 'cancelled']),
  userId: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

### 3. API Endpoints

#### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

#### Project Endpoints
- `GET /api/projects` - Get all projects for authenticated user
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

#### Task Endpoints
- `GET /api/tasks` - Get all tasks with optional filtering
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

#### Event Endpoints
- `GET /api/events` - Get all events for authenticated user
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

#### Health Check
- `GET /api/health` - Server health status

### 4. Database Indexes

The migration script creates the following indexes for optimal performance:

**User Collection:**
- `email` (unique)
- `username` (unique)

**Project Collection:**
- `userId`
- `status`
- `priority`
- `createdAt` (descending)

**Task Collection:**
- `userId`
- `projectId`
- `status`
- `priority`
- `dueDate`
- `completed`

**Event Collection:**
- `userId`
- `start`
- `end`
- `projectId`
- `taskId`

## Development Setup

### 1. Start the Backend Server

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start

# Development with network access
npm run dev:lan
```

### 2. Start Full Development Environment

```bash
# Start both frontend and backend concurrently
npm run dev:full
```

This command starts:
- Frontend development server on `http://localhost:5173`
- Backend API server on `http://localhost:3000`

### 3. Verify Setup

1. **Health Check**: Visit `http://localhost:3000/api/health`
2. **Frontend**: Visit `http://localhost:5173`
3. **Sample Login**: Use credentials from migration script output

## Production Deployment

### 1. Environment Variables

Ensure all production environment variables are set:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/trackdo
PORT=3000
NODE_ENV=production
JWT_SECRET=your-production-jwt-secret
FRONTEND_URL=https://your-frontend-domain.com
```

### 2. Database Setup

Run the migration script in production:

```bash
NODE_ENV=production node backend/migrations/setup-database.js
```

### 3. Server Deployment

```bash
# Install production dependencies
npm ci --only=production

# Start the server
npm start
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Verify MongoDB is running
   - Check MONGODB_URI in .env file
   - Ensure network connectivity for MongoDB Atlas

2. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing processes on port 3000

3. **CORS Issues**
   - Verify FRONTEND_URL in .env file
   - Check CORS configuration in server.js

### Database Management

**View Collections:**
```bash
# Connect to MongoDB shell
mongosh "mongodb://localhost:27017/trackdo"

# List collections
show collections

# View sample data
db.projects.find().limit(5)
db.tasks.find().limit(5)
```

**Reset Database:**
```bash
# Drop database and re-run migration
mongosh "mongodb://localhost:27017/trackdo" --eval "db.dropDatabase()"
node backend/migrations/setup-database.js
```

## Sample Data

The migration script creates sample data including:

- **Demo User**: `demo@trackdo.com` / `demo123`
- **2 Sample Projects**: Web development and mobile app projects
- **3 Sample Tasks**: Various statuses and priorities
- **2 Sample Events**: Meeting and deadline events

## Security Considerations

1. **Environment Variables**: Never commit .env files to version control
2. **JWT Secret**: Use a strong, unique secret in production
3. **Password Hashing**: Implement proper password hashing for production
4. **Input Validation**: All API endpoints include input validation
5. **CORS**: Configured to allow only specified frontend domains

## Performance Optimization

1. **Database Indexes**: Comprehensive indexing for all query patterns
2. **Connection Pooling**: Mongoose handles MongoDB connection pooling
3. **Middleware**: Efficient middleware stack with compression and caching headers
4. **Error Handling**: Proper error handling to prevent server crashes

## Support

For issues or questions regarding the MongoDB setup or backend configuration, please refer to:

- MongoDB Documentation: https://docs.mongodb.com/
- Mongoose Documentation: https://mongoosejs.com/docs/
- Express.js Documentation: https://expressjs.com/

---

**Last Updated**: December 2024  
**Version**: 1.0.0