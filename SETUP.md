# Task Manager Application - Setup Guide

## Quick Start Guide

### 1. Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database
- Git

### 2. Database Setup
1. Install PostgreSQL on your system
2. Create a new database named `taskmanager`:
   ```sql
   CREATE DATABASE taskmanager;
   ```
3. Update the database credentials in `backend/.env` if needed

### 3. Environment Configuration
- Backend environment variables are in `backend/.env`
- Update the database credentials to match your PostgreSQL setup
- Change the JWT_SECRET to a secure random string for production

### 4. Starting the Application

#### Start Backend Server:
```bash
cd backend
npm start
```
The backend will run on http://localhost:6000

#### Start Frontend Development Server:
```bash
cd frontend
npm start
```
The frontend will run on http://localhost:3000

### 5. Testing the Application

1. Open http://localhost:3000 in your browser
2. Register a new account
3. Login with your credentials
4. Start creating and managing tasks!

### 6. API Endpoints

**Authentication:**
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user

**Tasks:**
- GET `/api/tasks` - Get all tasks for authenticated user
- POST `/api/tasks` - Create a new task
- PUT `/api/tasks/:id` - Update a task
- DELETE `/api/tasks/:id` - Delete a task

### 7. Features

**Authentication:**
- JWT-based authentication
- Secure password hashing with bcrypt
- Protected routes

**Task Management:**
- Create, read, update, delete tasks
- Task priorities (Low, Medium, High)
- Task status (Pending, In Progress, Completed)
- Due dates
- Search and filter functionality
- Pagination

**Frontend:**
- Responsive design
- React with Context API for state management
- Toast notifications
- Form validation
- Clean, modern UI

### 8. Deployment

The application includes Docker configuration for easy deployment:

```bash
# Build and run with Docker Compose
docker-compose up --build
```

### 9. Environment Variables Reference

**Backend (.env):**
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 5000)
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - JWT expiration time
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_NAME` - Database name
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `CLIENT_URL` - Frontend URL for CORS

### 10. Troubleshooting

**Common Issues:**

1. **Database Connection Error:**
   - Ensure PostgreSQL is running
   - Check database credentials in `.env`
   - Verify database name exists

2. **Port Already in Use:**
   - Change PORT in backend `.env`
   - Or kill the process using the port

3. **CORS Issues:**
   - Ensure CLIENT_URL in backend `.env` matches frontend URL

4. **Dependencies Issues:**
   - Delete `node_modules` and run `npm install` again
   - Clear npm cache: `npm cache clean --force`

### 11. Development

**Project Structure:**
```
frontend-backend/
├── backend/           # Express.js API server
│   ├── config/       # Database configuration
│   ├── controllers/  # Route controllers
│   ├── middleware/   # Custom middleware
│   ├── models/       # Sequelize models
│   ├── routes/       # API routes
│   └── server.js     # Main server file
└── frontend/         # React application
    ├── public/       # Static assets
    └── src/          # React source code
        ├── components/   # React components
        ├── context/      # Context providers
        ├── pages/        # Page components
        ├── services/     # API services
        └── styles/       # CSS styles
```

**Technologies Used:**
- **Backend:** Node.js, Express.js, PostgreSQL, Sequelize ORM, JWT, bcrypt
- **Frontend:** React 18, React Router, Axios, Context API
- **Styling:** Custom CSS with responsive design
- **Authentication:** JWT with HTTP-only cookies and localStorage
- **Database:** PostgreSQL with Sequelize ORM

Enjoy building with your new Task Manager application! 🚀
