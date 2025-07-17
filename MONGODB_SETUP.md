# MongoDB Integration Setup

The TrackDo project has been configured to integrate with MongoDB. Below is the setup guide:

## 🔧 Environment Configuration

### 1. `.env` File
Ensure the `.env` file in the root directory contains the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=trackdo

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Environment
NODE_ENV=development
```

### 2. Install Dependencies
```bash
npm install
```

## 🗄️ MongoDB Data Structure

### Collections:
- **projects**: Store project information
- **tasks**: Store task information
- **events**: Store event/calendar information

### Sample Schemas:

#### Projects Collection:
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  status: String, // 'Planning', 'Active', 'Completed', 'On Hold'
  priority: String, // 'Low', 'Medium', 'High'
  startDate: Date,
  endDate: Date,
  progress: Number, // 0-100
  teamMembers: [String],
  tags: [String],
  milestones: [{
    id: Number,
    title: String,
    date: Date,
    completed: Boolean
  }],
  createdAt: Date,
  updatedAt: Date
}
```

#### Tasks Collection:
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  completed: Boolean,
  priority: String, // 'Low', 'Medium', 'High'
  dueDate: Date,
  projectId: ObjectId,
  assignee: String,
  tags: [String],
  estimatedHours: Number,
  actualHours: Number,
  createdAt: Date,
  updatedAt: Date
}
```

#### Events Collection:
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  start: Date,
  end: Date,
  allDay: Boolean,
  type: String, // 'meeting', 'work', 'social', 'milestone'
  priority: String, // 'Low', 'Medium', 'High'
  location: String,
  attendees: [String],
  color: String,
  recurring: {
    enabled: Boolean,
    frequency: String, // 'daily', 'weekly', 'monthly'
    interval: Number,
    endDate: Date
  },
  reminders: [{
    type: String, // 'notification', 'email'
    minutes: Number
  }],
  projectId: ObjectId,
  taskId: ObjectId,
  status: String, // 'confirmed', 'tentative', 'cancelled'
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Backend API Requirements

The application requires a backend API with the following endpoints:

### Projects API:
- `GET /api/projects` - Get list of projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks API:
- `GET /api/tasks` - Get list of tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Events API:
- `GET /api/events` - Get list of events
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Health Check:
- `GET /api/health` - Check API status

## 🛠️ Development

### Run the application:
```bash
npm run dev
```

### Check MongoDB connection:
Open Developer Console in the browser to view connection logs.

## 📝 Notes

1. **CORS**: Ensure backend API allows CORS from frontend
2. **Authentication**: JWT tokens are stored in localStorage
3. **Error Handling**: All API errors are handled and logged
4. **Performance**: Data is cached in Pinia stores

## 🔧 Troubleshooting

### MongoDB Connection Issues:
1. Check if MongoDB server is running
2. Verify MONGODB_URI in .env file
3. Check network connectivity

### API Errors:
1. Confirm backend server is running on port 3000
2. Check VITE_API_BASE_URL in .env file
3. View Network tab in Developer Tools

### Data Not Displaying:
1. Open Console to view error logs
2. Check if stores are properly initialized
3. Verify API responses in Network tab

## 🔗 Related Documentation

For complete setup and usage instructions, please refer to the main [README.md](./README.md) file.

## 📊 Database Management

### Recommended Tools:
- **MongoDB Compass**: GUI for MongoDB management
- **Studio 3T**: Advanced MongoDB IDE
- **Robo 3T**: Lightweight MongoDB GUI

### Backup & Restore:
```bash
# Backup database
mongodump --db trackdo --out ./backup

# Restore database
mongorestore --db trackdo ./backup/trackdo
```

### Performance Optimization:
- Create indexes on frequently queried fields
- Use aggregation pipelines for complex queries
- Implement proper pagination for large datasets
- Monitor query performance with MongoDB profiler