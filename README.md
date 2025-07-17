<div align="center">
  <img src="public/logo.gif" alt="TrackDo Logo" width="120" height="120">
  
  # 🚀 TrackDo - Task Management Application
  
  <p align="center">
    <strong>A comprehensive task management application built with Vue.js 3, Vuetify, and MongoDB</strong>
  </p>
  
  <p align="center">
    <img src="https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue.js">
    <img src="https://img.shields.io/badge/Vuetify-3.x-1867C0?style=for-the-badge&logo=vuetify&logoColor=white" alt="Vuetify">
    <img src="https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
    <img src="https://img.shields.io/badge/MongoDB-4.4+-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  </p>
  
  <p align="center">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="License">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge" alt="PRs Welcome">
    <img src="https://img.shields.io/badge/Maintained-Yes-green.svg?style=for-the-badge" alt="Maintained">
  </p>
</div>

---

## 📚 Table of Contents

- [📖 About TrackDo](#-about-trackdo)
- [🚀 What Has Been Accomplished](#-what-has-been-accomplished)
- [📁 Project Structure](#-project-structure)
- [🛠 System Requirements](#-system-requirements)
- [📦 Installation & Setup](#-installation--setup)
- [🚀 Running the Application](#-running-the-application)
- [🔌 API Endpoints](#-api-endpoints)
- [✨ Features Implemented](#-features-implemented)
- [🛠 Technologies Used](#-technologies-used)
- [🔧 Development Commands](#-development-commands)
- [🎯 Recent Improvements & Fixes](#-recent-improvements--fixes)
- [🚨 Troubleshooting](#-troubleshooting)
- [📈 Future Enhancements](#-future-enhancements)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 📖 About TrackDo

TrackDo is a modern, full-stack task management application that helps you organize your projects, tasks, and events efficiently. Built with cutting-edge technologies, it offers a beautiful, responsive user interface that works seamlessly across all devices.

### ✨ Key Highlights
- 🎯 **Complete Project Management** - From planning to completion
- ✅ **Advanced Task System** - Priority-based task organization
- 📅 **Integrated Calendar** - Schedule and track events
- 🎨 **Modern UI/UX** - Clean, intuitive interface with dark/light themes
- 📱 **Fully Responsive** - Works perfectly on desktop, tablet, and mobile
- 🔄 **Real-time Updates** - Dynamic state management with Pinia

## 🚀 What Has Been Accomplished

<div align="center">
  
### 🖼️ Application Screenshots

<table>
  <tr>
    <td align="center">
      <img src="public/hero.gif" alt="Dashboard" width="400">
      <br>
      <strong>📊 Dashboard Overview</strong>
    </td>
    <td align="center">
      <img src="public/hero.svg" alt="Project Management" width="400">
      <br>
      <strong>📋 Project Management</strong>
    </td>
  </tr>
</table>

### 🎯 Quick Demo
> **Live Demo**: [TrackDo Application](http://localhost:5174) *(when running locally)*

</div>

---

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

<div align="center">
  <img src="https://img.shields.io/badge/Setup_Time-5_minutes-brightgreen?style=for-the-badge" alt="Setup Time">
  <img src="https://img.shields.io/badge/Difficulty-Easy-green?style=for-the-badge" alt="Difficulty">
</div>

### 🔧 Prerequisites

Before you begin, ensure you have the following installed:

| Requirement | Version | Download Link |
|-------------|---------|---------------|
| ![Node.js](https://img.shields.io/badge/Node.js-v16+-339933?logo=node.js&logoColor=white) | 16.0+ | [Download Node.js](https://nodejs.org/) |
| ![MongoDB](https://img.shields.io/badge/MongoDB-v4.4+-47A248?logo=mongodb&logoColor=white) | 4.4+ | [Download MongoDB](https://www.mongodb.com/try/download/community) |
| ![Git](https://img.shields.io/badge/Git-Latest-F05032?logo=git&logoColor=white) | Latest | [Download Git](https://git-scm.com/) |

### 🚀 Quick Start

#### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/trackdo.git
cd trackdo
```

#### Step 2: Install Dependencies
```bash
# Install all dependencies (frontend + backend)
npm run install:all
```

<details>
<summary>📋 Alternative: Install Separately</summary>

```bash
# Frontend dependencies
npm install

# Backend dependencies
npm run backend:install
```
</details>

#### Step 3: Environment Setup

1. **Copy environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Configure your `.env` file:**
   ```env
   # Frontend Configuration
   VITE_API_BASE_URL=http://localhost:3000/api

   # Backend Configuration  
   MONGODB_URI=mongodb://localhost:27017/trackdo
   MONGODB_DB_NAME=trackdo
   PORT=3000
   CORS_ORIGIN=http://localhost:5173

   # Environment
   NODE_ENV=development
   ```

#### Step 4: Start MongoDB
```bash
# Windows
net start MongoDB

# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

#### Step 5: Launch the Application
```bash
# Start both frontend and backend
npm run dev:full
```

### 🎉 Success!

Your application should now be running:
- **Frontend**: http://localhost:5173 (or http://localhost:5174)
- **Backend API**: http://localhost:3000/api
- **MongoDB**: mongodb://localhost:27017/trackdo

<div align="center">
  <img src="https://img.shields.io/badge/Status-Ready_to_Go!-success?style=for-the-badge" alt="Ready">
</div>

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

### Technical Improvements
- **Testing**: Unit and integration test coverage
- **CI/CD**: Automated deployment pipeline
- **Docker**: Containerization for easier deployment
- **Performance**: Code splitting and lazy loading
- **PWA**: Progressive Web App capabilities

## 🤝 Contributing

We welcome contributions to TrackDo! Here's how you can help:

### 🌟 Ways to Contribute

- 🐛 **Report Bugs**: Found a bug? [Open an issue](https://github.com/your-username/trackdo/issues)
- 💡 **Suggest Features**: Have an idea? [Create a feature request](https://github.com/your-username/trackdo/issues)
- 🔧 **Submit Pull Requests**: Ready to code? Fork and submit a PR
- 📖 **Improve Documentation**: Help make our docs better
- 🎨 **Design Improvements**: Enhance the UI/UX

### 📋 Development Workflow

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Run tests**: `npm run lint`
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### 📝 Code Style

- Follow the existing code style
- Use meaningful commit messages
- Add comments for complex logic
- Update documentation when needed

<div align="center">
  <img src="https://img.shields.io/badge/Contributions-Welcome-brightgreen?style=for-the-badge" alt="Contributions Welcome">
</div>

## 📄 License

<div align="center">
  
### MIT License

**TrackDo** is open source software licensed under the [MIT License](LICENSE).

```
Copyright (c) 2024 TrackDo Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

<img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="MIT License">

</div>

---

<div align="center">
  
### 🌟 Star this repository if you found it helpful!

<img src="public/logo.gif" alt="TrackDo Logo" width="60" height="60">

**TrackDo** - *Streamline your workflow, track your progress, achieve your goals!* 🚀

<p>
  <a href="#-table-of-contents">⬆️ Back to Top</a>
</p>

---

<sub>Built with ❤️ by the TrackDo Team</sub>

</div>