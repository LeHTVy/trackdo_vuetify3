# TrackDo - Task Management Application

TrackDo is a comprehensive task management application built with Vue.js 3, Vuetify, and MongoDB. This modern web application provides a complete solution for managing projects, tasks, and events with a beautiful, responsive user interface.

## 🚀 What Has Been Accomplished

### ✅ Complete Full-Stack Application
- **Frontend**: Modern Vue.js 3 application with Vuetify UI framework
- **Backend**: RESTful API server built with Node.js and Express
- **Database**: MongoDB integration with Mongoose ODM
- **State Management**: Pinia stores for centralized data management
- **Routing**: Vue Router for single-page application navigation

### ✅ Core Features Implemented
- **Project Management**: Create, read, update, delete projects with progress tracking
- **Task Management**: Comprehensive task system with priorities, statuses, and filtering
- **Event Management**: Calendar-based event system with scheduling capabilities
- **Responsive Design**: Mobile-first design that works on all devices
- **Real-time Updates**: Dynamic UI updates with reactive state management

### ✅ UI/UX Enhancements
- **Modern Interface**: Clean, professional design with Vuetify components
- **Dark/Light Theme**: Automatic theme switching support
- **Hidden Scrollbars**: Custom scrollbar styling for cleaner appearance
- **Floating Action Buttons**: Intuitive FAB buttons for quick actions
- **Responsive Layout**: Optimized layouts for desktop, tablet, and mobile

### ✅ Technical Architecture
- **Component-Based**: Modular Vue components for maintainability
- **Store Pattern**: Centralized state management with Pinia
- **API Integration**: Axios-based HTTP client for backend communication
- **Validation**: Form validation and error handling
- **Security**: CORS, Helmet, and other security middleware

## 📁 Project Structure

```
trackdo/
├── src/                          # Frontend source code
│   ├── components/              # Reusable Vue components
│   │   ├── calendar/           # Calendar-specific components
│   │   ├── projects/           # Project management components
│   │   ├── tasks/              # Task management components
│   │   └── common/             # Shared components
│   ├── pages/                  # Main application pages
│   ├── stores/                 # Pinia state management
│   ├── services/               # API and external services
│   ├── router/                 # Vue Router configuration
│   ├── styles/                 # Global CSS and SCSS
│   └── plugins/                # Vue plugins and configurations
├── backend/                     # Backend API server
│   ├── models/                 # MongoDB models
│   ├── routes/                 # Express routes
│   ├── middleware/             # Custom middleware
│   └── server.js               # Main server file
├── public/                     # Static assets
├── package.json                # Frontend dependencies & scripts
└── README.md                   # This file
```

## 🛠 System Requirements

- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**
- **Modern Web Browser** (Chrome, Firefox, Safari, Edge)

## 📦 Installation & Setup

### 1. Install All Dependencies

```bash
npm run install:all
```

Or install separately:

```bash
# Frontend dependencies
npm install

# Backend dependencies
npm run backend:install
```

### 2. MongoDB Configuration

Ensure MongoDB is running on `mongodb://localhost:27017/trackdo`

### 3. Environment Configuration

Check the `.env` file in the `backend/` directory:

```env
MONGODB_URI=mongodb://localhost:27017/trackdo
NODE_ENV=development
PORT=3000
```

## 🚀 Running the Application

### Run Both Frontend and Backend (Recommended)

```bash
npm run dev:full
```

This command starts both servers concurrently:
- Frontend: `http://localhost:5173` (or `http://localhost:5174` if 5173 is busy)
- Backend: `http://localhost:3000`

### Run Separately

```bash
# Frontend only (port 5173/5174)
npm run dev

# Backend only (port 3000)
npm run backend:dev
```

## 🔌 API Endpoints

Backend API runs on `http://localhost:3000/api`

### Health Check
- `GET /api/health` - Check API status and connectivity

### Projects API
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update existing project
- `DELETE /api/projects/:id` - Delete project

### Tasks API
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update existing task
- `DELETE /api/tasks/:id` - Delete task

### Events API
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update existing event
- `DELETE /api/events/:id` - Delete event

## ✨ Features Implemented

### 📊 Dashboard & Analytics
- **Quick Stats**: Overview of projects, tasks, and events
- **Progress Tracking**: Visual progress indicators for projects
- **Status Management**: Track completion status across all entities

### 📋 Project Management
- **CRUD Operations**: Create, read, update, delete projects
- **Progress Tracking**: Visual progress bars and percentage completion
- **Status Management**: Active, completed, on-hold project states
- **Priority Levels**: High, medium, low priority classification
- **Filtering & Search**: Advanced filtering by status, priority, and search terms

### ✅ Task Management
- **Comprehensive Task System**: Full task lifecycle management
- **Priority System**: High, medium, low priority tasks
- **Status Tracking**: Todo, in-progress, completed, cancelled states
- **Due Date Management**: Date-based task scheduling
- **Tag System**: Categorize tasks with custom tags
- **Advanced Filtering**: Filter by status, priority, tags, and search

### 📅 Event Management
- **Calendar Integration**: Visual calendar interface
- **Event Scheduling**: Create and manage events with dates and times
- **Event Types**: Different event categories and classifications
- **Recurring Events**: Support for repeating events
- **Event Details**: Rich event descriptions and metadata

### 🎨 User Interface
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Clean, professional interface with Vuetify components
- **Dark/Light Theme**: Automatic theme detection and switching
- **Hidden Scrollbars**: Custom scrollbar styling for cleaner appearance
- **Floating Action Buttons**: Quick access to create new items
- **Loading States**: Smooth loading indicators and transitions
- **Error Handling**: User-friendly error messages and validation

## 🛠 Technologies Used

### Frontend Stack
- **Vue.js 3** - Progressive JavaScript framework
- **Vuetify 3** - Material Design component framework
- **Pinia** - State management library
- **Vue Router** - Client-side routing
- **Axios** - HTTP client for API communication
- **Vite** - Fast build tool and development server
- **SCSS/CSS** - Styling with preprocessor support

### Backend Stack
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger
- **dotenv** - Environment variable management

### Development Tools
- **ESLint** - Code linting and formatting
- **Concurrently** - Run multiple commands simultaneously
- **Nodemon** - Auto-restart development server
- **Unplugin** - Auto-import and component registration

## 🔧 Development Commands

### Linting & Code Quality

```bash
# Run ESLint to check and fix code issues
npm run lint
```

### Building for Production

```bash
# Build the frontend application
npm run build
```

### Preview Production Build

```bash
# Preview the built application
npm run preview
```

### Backend Development

```bash
# Start backend in development mode with auto-restart
npm run backend:dev

# Start backend in production mode
cd backend && npm start
```

## 🎯 Recent Improvements & Fixes

### Layout Optimizations
- **Fixed ProjectsList Display**: Resolved width issues to ensure full container utilization
- **Responsive Grid System**: Improved Vuetify grid layout with proper flex properties
- **Column Alignment**: Fixed stats and projects column alignment issues

### UI/UX Enhancements
- **FAB Button Styling**: Removed unwanted borders and outlines from floating action buttons
- **Scrollbar Customization**: Implemented global scrollbar hiding for cleaner appearance
- **Theme Consistency**: Ensured consistent styling across light and dark themes

### Performance Improvements
- **Global CSS**: Centralized styling for better maintainability
- **Component Optimization**: Improved component structure and prop handling
- **State Management**: Enhanced Pinia store organization and data flow

## 🚨 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB service is running
- Check connection string in `.env` file
- Verify firewall settings for port 27017
- Check MongoDB logs for connection errors

### API 404 Errors
- Ensure backend server is running on port 3000
- Check CORS configuration in backend
- Verify API endpoints in browser DevTools
- Check network requests and responses

### Port Conflicts
- **Frontend**: Default port 5173, fallback to 5174
- **Backend**: Default port 3000
- **MongoDB**: Default port 27017
- Modify port configurations in respective config files if needed

### Build Issues
- Clear node_modules and reinstall dependencies
- Check Node.js version compatibility
- Verify all environment variables are set
- Check for syntax errors in code

## 📈 Future Enhancements

### Planned Features
- **User Authentication**: Login/logout functionality
- **Real-time Notifications**: WebSocket-based notifications
- **File Attachments**: Upload and manage files for projects/tasks
- **Team Collaboration**: Multi-user support and permissions
- **Advanced Analytics**: Detailed reporting and analytics dashboard
- **Mobile App**: React Native or Flutter mobile application
- **UI/UX Enhancements**: Improved user interface and experience




#   t r a c k d o _ v u e t i f y 3  
 