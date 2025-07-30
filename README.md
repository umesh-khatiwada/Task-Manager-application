# Task Manager - Full Stack MERN Application

A secure, full-stack Task Manager application built with the MERN stack (MongoDB/PostgreSQL, Express.js, React, Node.js) featuring user authentication, task management, and a responsive UI.

## 🚀 Features

### Authentication
- User registration and login with JWT-based authentication
- Secure password hashing using bcrypt
- Protected routes with authentication middleware
- Automatic token refresh and logout handling

### Task Management
- ✅ Create tasks with title, description, priority, and due date
- ✅ View all user tasks with pagination
- ✅ Update and delete existing tasks
- ✅ Mark tasks as complete/incomplete
- ✅ Visual highlighting of overdue tasks
- ✅ Sort tasks by due date, priority, creation date, or title
- ✅ Filter tasks by priority and completion status
- ✅ Server-side pagination for optimal performance

### User Interface
- 🎨 Clean, responsive design that works on all devices
- 🔄 Real-time updates using React Context API
- 📱 Mobile-friendly responsive layout
- 🎯 Intuitive task management interface
- 🔔 Toast notifications for user feedback
- ⚡ Fast and smooth user experience

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database (with Sequelize ORM)
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **React Router DOM** - Client-side routing
- **React Context API** - State management
- **Axios** - HTTP client
- **React Icons** - Icon library
- **React Toastify** - Notifications
- **CSS3** - Styling with custom responsive design

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone <repository-url>
cd task-manager
```

### 2. Database Setup
1. Install and start PostgreSQL
2. Create a new database:
```sql
CREATE DATABASE task_manager;
```

### 3. Backend Setup
```bash
cd backend
npm install

# Create environment file
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
NODE_ENV=development
PORT=5001
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRE=7d

# Database configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=task_manager
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_URL=postgresql://your_db_username:your_db_password@localhost:5432/task_manager

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:3000
```

### 4. Frontend Setup
```bash
cd frontend
npm install

# Optional: Create environment file for custom API URL
echo "REACT_APP_API_URL=http://localhost:5001/api" > .env
```

## 🚀 Running the Application

### Development Mode

1. **Start the Backend Server:**
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:5001`

2. **Start the Frontend Development Server:**
```bash
cd frontend
npm start
```
The frontend will run on `http://localhost:3000`

### Production Mode

1. **Build the Frontend:**
```bash
cd frontend
npm run build
```

2. **Start the Backend:**
```bash
cd backend
npm start
```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

#### Login User
```http
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

#### Get Current User
```http
GET /api/me
Authorization: Bearer <jwt_token>
```

#### Logout User
```http
POST /api/logout
Authorization: Bearer <jwt_token>
```

### Task Management Endpoints

#### Get All Tasks
```http
GET /api/tasks?page=1&limit=10&sortBy=created_at&sortOrder=DESC&priority=high&completed=false
Authorization: Bearer <jwt_token>
```

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive README and API docs",
  "priority": "high",
  "end_date": "2024-12-31T23:59:59.000Z"
}
```

#### Update Task
```http
PUT /api/tasks/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Updated task title",
  "completed": true
}
```

#### Delete Task
```http
DELETE /api/tasks/:id
Authorization: Bearer <jwt_token>
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds for secure password storage
- **Input Validation**: Comprehensive validation using express-validator
- **CORS Protection**: Configured for specific origins
- **SQL Injection Prevention**: Sequelize ORM provides protection
- **XSS Protection**: Input sanitization and validation
- **Error Handling**: Secure error messages without sensitive data exposure

## 🎨 UI/UX Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Intuitive Interface**: Clean and user-friendly design
- **Real-time Feedback**: Toast notifications for all user actions
- **Loading States**: Visual feedback during API operations
- **Error Handling**: User-friendly error messages
- **Accessibility**: Semantic HTML and keyboard navigation support

## 🔍 Key Implementation Details

### JWT Token Storage
- **Choice**: HTTP-only cookies + localStorage
- **Justification**: 
  - Cookies provide CSRF protection and automatic transmission
  - localStorage enables easy token access for Authorization headers
  - Dual storage provides redundancy and flexibility

### State Management
- **React Context API**: Chosen over Redux for simplicity
- **Separation of Concerns**: Separate contexts for Auth and Tasks
- **Optimistic Updates**: Immediate UI updates with fallback handling

### Database Schema
```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  priority VARCHAR(10) CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  end_date TIMESTAMP NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🧪 Testing

### Manual Testing Checklist

#### Authentication
- [ ] User registration with validation
- [ ] User login with email/password
- [ ] Protected route access
- [ ] Token expiration handling
- [ ] Logout functionality

#### Task Management
- [ ] Create new tasks
- [ ] View task list with pagination
- [ ] Edit existing tasks
- [ ] Delete tasks
- [ ] Mark tasks as complete/incomplete
- [ ] Filter and sort tasks
- [ ] Overdue task highlighting

#### UI/UX
- [ ] Responsive design on different screen sizes
- [ ] Loading states during API calls
- [ ] Error handling and user feedback
- [ ] Form validation
- [ ] Navigation between pages

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Deployment Options

### Option 1: Heroku + PostgreSQL
1. Create Heroku app
2. Add PostgreSQL addon
3. Set environment variables
4. Deploy backend and frontend

### Option 2: Digital Ocean + PM2
1. Set up Digital Ocean droplet
2. Install Node.js and PostgreSQL
3. Use PM2 for process management
4. Set up reverse proxy with Nginx

### Option 3: Railway + Supabase
1. Deploy backend on Railway
2. Use Supabase for PostgreSQL
3. Deploy frontend on Vercel/Netlify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 👨‍💻 Author

Your Name - contact.khatiwaxx@gmail.com

Project Link: [https://github.com/umesh-khatiwada/Task-Manager-application](https://github.com/umesh-khatiwada/Task-Manager-application)

## 🙏 Acknowledgments

- React team for the amazing library
- Express.js community for the robust framework
- PostgreSQL for the reliable database
- All open-source contributors who made this project possible
