# University E-Learning Platform

A comprehensive full-stack E-learning platform built with React, Node.js, Express, and MongoDB. Features separate student and teacher interfaces with course management, lectures, assignments, quizzes, and coding practice.

## 🚀 Features

### Student Features
- **Dashboard**: View enrolled courses, pending assignments, and announcements
- **Course Browsing**: Browse and enroll in available courses
- **Lectures**: Watch video lectures, view notes, and download resources
- **Assignments**: Submit assignments and view grades/feedback
- **Quizzes**: Take multiple-choice quizzes with automatic scoring
- **Coding Practice**: Solve coding problems with mock evaluation
- **Profile Management**: Update profile information and change password

### Teacher Features
- **Dashboard**: Overview of courses, students, and assignments
- **Course Management**: Create, edit, publish/unpublish, and delete courses
- **Lecture Management**: Add lectures with videos, notes, and resources
- **Assignment Management**: Create assignments, view submissions, and grade students
- **Quiz Management**: Create quizzes with multiple-choice questions
- **Coding Problems**: Create programming challenges
- **Announcements**: Post announcements to students

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

## 🛠️ Installation

### 1. Clone the repository
```bash
cd E-learning
```

### 2. Set up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/elearning
JWT_SECRET=your_super_secret_jwt_key_change_in_production_12345
NODE_ENV=development
```

### 3. Set up the Frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:
```bash
# On Windows (if installed as service)
net start MongoDB

# On macOS/Linux
sudo systemctl start mongod
# OR
mongod
```

### 5. Seed the Database

Run this command to populate the database with sample data:
```bash
cd backend
npm run seed
```

This will create:
- 1 Teacher account
- 2 Student accounts
- 3 Sample courses with lectures
- Assignments, quizzes, and coding problems

## 🎯 Running the Application

### Start the Backend Server

```bash
cd backend
npm run dev
```

The API will run on `http://localhost:5000`

### Start the Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

## 👤 Default Credentials

### Teacher Account
- **Email**: `teacher@university.edu`
- **Password**: `password123`

### Student Accounts
- **Email**: `student@university.edu`
- **Password**: `password123`

- **Email**: `jane@university.edu`
- **Password**: `password123`

## 📁 Project Structure

```
E-learning/
├── backend/
│   ├── config/          # Database configuration
│   ├── models/          # Mongoose schemas
│   ├── controllers/     # Route controllers
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & role middleware
│   ├── utils/           # Helper functions
│   ├── server.js        # Express app entry
│   └── seedData.js      # Database seeding script
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React context (Auth)
│   │   ├── layouts/     # Layout components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── App.jsx      # Main app with routing
│   │   └── main.jsx     # React entry point
│   └── index.html       # HTML template
│
└── README.md
```

## 🔧 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Courses
- `GET /api/courses` - Get all published courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course (Teacher)
- `PUT /api/courses/:id` - Update course (Teacher)
- `DELETE /api/courses/:id` - Delete course (Teacher)
- `POST /api/courses/:id/enroll` - Enroll in course (Student)
- `DELETE /api/courses/:id/enroll` - Unenroll from course (Student)

### Lectures
- `GET /api/lectures/course/:courseId` - Get lectures by course
- `GET /api/lectures/:id` - Get lecture by ID
- `POST /api/lectures` - Create lecture (Teacher)
- `PUT /api/lectures/:id` - Update lecture (Teacher)
- `DELETE /api/lectures/:id` - Delete lecture (Teacher)

### Assignments
- `GET /api/assignments/my-assignments` - Get student's assignments
- `GET /api/assignments/:id` - Get assignment by ID
- `POST /api/assignments` - Create assignment (Teacher)
- `POST /api/assignments/:id/submit` - Submit assignment (Student)
- `GET /api/assignments/:id/submissions` - Get submissions (Teacher)
- `PUT /api/submissions/:id/grade` - Grade submission (Teacher)

### Quizzes
- `GET /api/quizzes/course/:courseId` - Get quizzes by course
- `GET /api/quizzes/:id` - Get quiz by ID
- `POST /api/quizzes` - Create quiz (Teacher)
- `POST /api/quizzes/:id/questions` - Add question (Teacher)
- `POST /api/quizzes/:id/attempt` - Submit quiz attempt (Student)
- `GET /api/quizzes/:id/attempts` - Get quiz attempts

### Coding Problems
- `GET /api/coding-problems` - Get all problems
- `GET /api/coding-problems/:id` - Get problem by ID
- `POST /api/coding-problems` - Create problem (Teacher)
- `POST /api/coding-problems/:id/submit` - Submit code (Student)

### Announcements
- `GET /api/announcements` - Get announcements
- `POST /api/announcements` - Create announcement (Teacher)

## 🎨 Design Features

- **Modern Gradient UI**: Beautiful gradient backgrounds and card designs
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Role-based Navigation**: Different interfaces for students and teachers
- **Real-time Validation**: Form validation and error handling
- **Smooth Animations**: Hover effects and transitions

## ⚙️ Development Scripts

### Backend
```bash
npm start       # Start server
npm run dev     # Start with nodemon
npm run seed    # Seed database
```

### Frontend
```bash
npm run dev     # Start dev server
npm run build   # Build for production
npm run preview # Preview production build
```

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control
- Protected API routes
- Input validation

## 📝 Notes

- **Video URLs**: Lectures support YouTube embed URLs or external video links
- **File Uploads**: Assignment submissions use URL strings (simulated file uploads)
- **Code Evaluation**: Coding practice uses mock evaluation (not real code execution)
- **Default Role**: Users without teacher selection are registered as students

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check the MONGODB_URI in backend/.env
- Verify MongoDB is installed correctly

### Port Already in Use
- Change PORT in backend/.env (default: 5000)
- Change port in frontend/vite.config.js (default: 3000)

### CORS Issues
- Ensure VITE_API_URL in frontend/.env matches backend URL
- Check proxy configuration in vite.config.js

## 📧 Support

For issues and questions, please create an issue in the repository.

---

**Built with ❤️ for university education**
