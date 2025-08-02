# Project Management System

A comprehensive project management application built with Node.js, Express, MongoDB, React, and TypeScript. This full-stack solution provides teams with powerful tools to organize workspaces, manage projects, track tasks, and collaborate effectively.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [Contact](#contact)

## Features

### 🏢 Workspace Management

- Create and manage multiple workspaces
- Invite team members with role-based access control
- Workspace-level permissions and settings

### 📋 Project Organization

- Create, edit, and archive projects
- Project status tracking (Planning, In Progress, On Hold, Completed, Cancelled)
- Progress monitoring with visual indicators
- Project tagging and categorization
- Due date management

### ✅ Task Management

- Create and assign tasks to team members
- Task status tracking and updates
- Comment system for task discussions
- Activity logging for audit trails
- Task dependencies and relationships

### 👥 User Management

- User registration and authentication
- Email verification system
- Password reset functionality
- User profiles and settings
- Role-based access control (Manager, Contributor, Viewer)

### 📊 Dashboard & Analytics

- Project and task statistics
- Recent activity feed
- Upcoming deadlines
- Progress charts and visualizations

### 📧 Email Notifications

- Automated email notifications for:
  - Workspace invitations
  - Task assignments
  - Project updates
  - Account verification

## Getting Started

### Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (v5.0 or higher)
- **Git**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ClowderDev/project-management.git
   cd project-management
   ```

2. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/project-management
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/project-management

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Email Configuration (Resend)
RESEND_API_KEY=your-resend-api-key
FROM_EMAIL=noreply@yourdomain.com

# Frontend URL
FRONTEND_URL=http://localhost:3000

# CORS Origins
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Running the Application

1. **Start the backend server**

   ```bash
   cd backend
   npm run dev
   ```

   The backend will be available at `http://localhost:5000`

2. **Start the frontend development server**

   ```bash
   cd frontend
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

3. **Access the application**
   Open your browser and navigate to `http://localhost:5173`

## Usage

### Authentication

1. Register a new account or login with existing credentials
2. Verify your email address through the verification link sent to your inbox

### Creating a Workspace

1. Navigate to the workspaces
2. Click "Create Workspace"
3. Fill in workspace details and invite team members

### Managing Projects

1. Select a workspace
2. Click "New Project" to create a project
3. Set project details, assign members, and set deadlines
4. Track progress through the project dashboard

### Task Management

1. Within a project, click "Add Task"
2. Assign tasks to team members
3. Set priorities, due dates, and descriptions
4. Use comments for collaboration and updates

## Project Structure

```
project-management/
├── backend/                 # Node.js/Express API server
│   ├── src/
│   │   ├── config/         # Database, environment, and service configs
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Authentication, error handling, etc.
│   │   ├── models/         # MongoDB/Mongoose models
│   │   ├── routes/         # API route definitions
│   │   ├── services/       # Business logic layer
│   │   ├── utils/          # Utility functions
│   │   ├── validation/     # Request validation schemas
│   │   └── mailers/        # Email templates and mailer service
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/               # React/TypeScript client
│   ├── app/
│   │   ├── components/     # Reusable UI components
│   │   ├── routes/         # Page components and routing
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions and configurations
│   │   ├── provider/       # Context providers
│   │   └── types/          # TypeScript type definitions
│   ├── public/             # Static assets
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

## Technologies Used

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Zod** - Schema validation
- **Resend** - Email service
- **Cors** - Cross-origin resource sharing

### Frontend

- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **React Router v7** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **React Hook Form** - Form management
- **Radix UI** - Headless UI components
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Build tool and development server
- **Recharts** - Data visualization
- **Lucide React** - Icon library

### Development Tools

- **Nodemon** - Development server auto-restart
- **ts-node** - TypeScript execution for Node.js

## Contributing

We welcome contributions to improve this project! Here's how you can help:

### Coding Standards

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write meaningful commit messages using conventional commits
- Add JSDoc comments for functions and classes
- Ensure responsive design for frontend components

### Bug Reports

When reporting bugs, please include:

- Operating system and browser version
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots if applicable

## Contact

**Project Maintainer:** ClowderDev

- **GitHub:** [@ClowderDev](https://github.com/ClowderDev)
- **Repository:** [project-management](https://github.com/ClowderDev/project-management)
- **Issues:** [Report a bug or request a feature](https://github.com/ClowderDev/project-management/issues)
