import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/common/Card';

export default function StudentDashboard() {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [stats, setStats] = useState({ enrolledCoursesCount: 0, pendingAssignmentsCount: 0, completedQuizzesCount: 0 });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [coursesRes, assignmentsRes, quizzesRes, announcementsRes, statsRes] = await Promise.all([
                api.get('/api/courses/enrolled'),
                api.get('/api/assignments/my-assignments'),
                api.get('/api/quizzes/my-attempts'), // Assuming this endpoint exists or similar
                api.get('/api/announcements'),
                api.get('/api/dashboard/student/stats')
            ]);

            setEnrolledCourses(coursesRes.data);
            setAssignments(assignmentsRes.data.slice(0, 5));
            setQuizzes(quizzesRes.data.slice(0, 5)); // Mocking quiz attempts for now if endpoint differs
            setAnnouncements(announcementsRes.data.slice(0, 3));
            setStats(statsRes.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            // Fallback for quizzes if endpoint doesn't exist yet
            setQuizzes([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    const upcomingAssignments = assignments.filter(a => !a.submission);
    const gradedAssignments = assignments.filter(a => a.submission?.marks !== null);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Student Dashboard</h1>

            {/* Stats */}
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card
                    className="bg-gradient-to-br from-blue-500 to-blue-600 text-white cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
                    onClick={() => navigate('/student/courses')}
                >
                    <div className="text-4xl mb-2">📚</div>
                    <div className="text-2xl font-bold">{stats.enrolledCoursesCount}</div>
                    <div className="text-blue-100">Enrolled Courses</div>
                </Card>
                <Card
                    className="bg-gradient-to-br from-purple-500 to-purple-600 text-white cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
                    onClick={() => navigate('/student/assignments')}
                >
                    <div className="text-4xl mb-2">📝</div>
                    <div className="text-2xl font-bold">{stats.pendingAssignmentsCount}</div>
                    <div className="text-purple-100">Pending Assignments</div>
                </Card>
                <Card
                    className="bg-gradient-to-br from-green-500 to-green-600 text-white cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
                    onClick={() => navigate('/student/assignments')}
                >
                    <div className="text-4xl mb-2">✅</div>
                    <div className="text-2xl font-bold">{gradedAssignments.length}</div>
                    <div className="text-green-100">Graded Assignments</div>
                </Card>
                <Card
                    className="bg-gradient-to-br from-orange-500 to-orange-600 text-white cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
                    onClick={() => navigate('/student/quizzes')}
                >
                    <div className="text-4xl mb-2">🏆</div>
                    <div className="text-2xl font-bold">{stats.completedQuizzesCount}</div>
                    <div className="text-orange-100">Completed Quizzes</div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Enrolled Courses */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">My Courses</h2>
                    {enrolledCourses.length === 0 ? (
                        <Card>
                            <p className="text-gray-500">You haven't enrolled in any courses yet.</p>
                            <button
                                onClick={() => navigate('/student/courses')}
                                className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
                            >
                                Browse Courses →
                            </button>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {enrolledCourses.map((course) => (
                                <Card
                                    key={course._id}
                                    onClick={() => navigate(`/student/courses/${course._id}`)}
                                    className="cursor-pointer hover:border-primary-300"
                                >
                                    <h3 className="font-semibold text-lg">{course.title}</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {course.teacher?.name} • {course.department}
                                    </p>
                                    {course.semester && (
                                        <span className="badge badge-info mt-2">{course.semester}</span>
                                    )}
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quiz Overview */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Quiz Overview</h2>
                    {quizzes.length === 0 ? (
                        <Card>
                            <p className="text-gray-500">No recent quiz activity.</p>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {quizzes.map((quiz) => (
                                <Card key={quiz._id}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold">{quiz.title}</h3>
                                            <p className="text-sm text-gray-600">{quiz.course?.title}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Score: {quiz.score}/{quiz.totalMarks}
                                            </p>
                                        </div>
                                        <span className="badge badge-success">Completed</span>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Upcoming Assignments */}
            <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Upcoming Assignments</h2>
                {upcomingAssignments.length === 0 ? (
                    <Card>
                        <p className="text-gray-500">No pending assignments.</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {upcomingAssignments.map((assignment) => (
                            <Card key={assignment._id}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold">{assignment.title}</h3>
                                        <p className="text-sm text-gray-600">{assignment.course?.title}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className="badge badge-warning">Pending</span>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
