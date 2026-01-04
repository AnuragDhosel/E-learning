import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NotFound from './pages/NotFound';
import StudentLayout from './layouts/StudentLayout';
import TeacherLayout from './layouts/TeacherLayout';

// Student pages
import StudentDashboard from './pages/student/Dashboard';
import StudentCourses from './pages/student/Courses';
import CourseDetails from './pages/student/CourseDetails';
import LectureView from './pages/student/LectureView';
import StudentAssignments from './pages/student/Assignments';
import AssignmentDetail from './pages/student/AssignmentDetail';
import QuizAttempt from './pages/student/QuizAttempt';
import StudentProfile from './pages/student/Profile';
import StudentNotes from './pages/student/Notes';
import StudentQuizzes from './pages/student/Quizzes';
import CodingPractice from './pages/student/CodingPractice';

// Teacher pages
import TeacherDashboard from './pages/teacher/Dashboard';
import ManageCourses from './pages/teacher/ManageCourses';
import CourseForm from './pages/teacher/CourseForm';
import CourseManagement from './pages/teacher/CourseManagement';
import TeacherCodingProblems from './pages/teacher/CodingProblems';
import TeacherStudents from './pages/teacher/Students';
import TeacherAssignments from './pages/teacher/Assignments';
import TeacherQuizzes from './pages/teacher/Quizzes';
import Announcements from './pages/common/Announcements';
import Settings from './pages/common/Settings';


// Protected route wrapper
function ProtectedRoute({ children, requiredRole }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to={`/${user.role}/dashboard`} replace />;
    }

    return children;
}

function AppRoutes() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={user ? <Navigate to={`/${user.role}/dashboard`} replace /> : <Landing />} />
            <Route path="/login" element={user ? <Navigate to={`/${user.role}/dashboard`} replace /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to={`/${user.role}/dashboard`} replace /> : <Register />} />

            {/* Student routes */}
            <Route
                path="/student"
                element={
                    <ProtectedRoute requiredRole="student">
                        <StudentLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="courses" element={<StudentCourses />} />
                <Route path="courses/:courseId" element={<CourseDetails />} />
                <Route path="courses/:courseId/lecture/:lectureId" element={<LectureView />} />
                <Route path="assignments" element={<StudentAssignments />} />
                <Route path="assignments/:assignmentId" element={<AssignmentDetail />} />
                <Route path="assignments/:assignmentId" element={<AssignmentDetail />} />
                <Route path="quizzes" element={<StudentQuizzes />} />
                <Route path="quizzes/:quizId" element={<QuizAttempt />} />
                <Route path="notes" element={<StudentNotes />} />
                <Route path="coding" element={<CodingPractice />} />
                <Route path="announcements" element={<Announcements />} />
                <Route path="settings" element={<Settings />} />
                <Route path="profile" element={<StudentProfile />} />
            </Route>

            {/* Teacher routes */}
            <Route
                path="/teacher"
                element={
                    <ProtectedRoute requiredRole="teacher">
                        <TeacherLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="dashboard" element={<TeacherDashboard />} />
                <Route path="courses" element={<ManageCourses />} />
                <Route path="courses/new" element={<CourseForm />} />
                <Route path="courses/:courseId/manage" element={<CourseManagement />} />
                <Route path="courses/:courseId/lectures" element={<Navigate to="../manage" replace />} />
                <Route path="students" element={<TeacherStudents />} />
                <Route path="assignments" element={<TeacherAssignments />} />
                <Route path="quizzes" element={<TeacherQuizzes />} />
                <Route path="coding" element={<TeacherCodingProblems />} />
                <Route path="announcements" element={<Announcements />} />
                <Route path="settings" element={<Settings />} />
                <Route path="profile" element={<StudentProfile />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}
