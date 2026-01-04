import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function TeacherDashboard() {
    const [courses, setCourses] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [stats, setStats] = useState({ studentCount: 0, assignmentCount: 0, quizCount: 0 });
    const [analytics, setAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [coursesRes, announcementsRes, statsRes, analyticsRes] = await Promise.all([
                api.get('/api/courses/my-courses'),
                api.get('/api/announcements'),
                api.get('/api/dashboard/teacher/stats'),
                api.get('/api/dashboard/teacher/analytics')
            ]);

            setCourses(coursesRes.data);
            setAnnouncements(announcementsRes.data.slice(0, 3));
            setStats(statsRes.data);
            setAnalytics(analyticsRes.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Teacher Dashboard</h1>

            {/* Stats */}
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card
                    className="bg-gradient-to-br from-blue-500 to-blue-600 text-white cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
                    onClick={() => navigate('/teacher/courses')}
                >
                    <div className="text-4xl mb-2">📚</div>
                    <div className="text-2xl font-bold">{courses.length}</div>
                    <div className="text-blue-100">My Courses</div>
                </Card>
                <Card
                    className="bg-gradient-to-br from-green-500 to-green-600 text-white cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
                    onClick={() => navigate('/teacher/students')}
                >
                    <div className="text-4xl mb-2">👥</div>
                    <div className="text-2xl font-bold">{stats.studentCount}</div>
                    <div className="text-green-100">Total Students</div>
                </Card>
                <Card
                    className="bg-gradient-to-br from-purple-500 to-purple-600 text-white cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
                    onClick={() => navigate('/teacher/assignments')}
                >
                    <div className="text-4xl mb-2">📝</div>
                    <div className="text-2xl font-bold">{stats.assignmentCount}</div>
                    <div className="text-purple-100">Assignments</div>
                </Card>
                <Card
                    className="bg-gradient-to-br from-orange-500 to-orange-600 text-white cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
                    onClick={() => navigate('/teacher/quizzes')}
                >
                    <div className="text-4xl mb-2">✏️</div>
                    <div className="text-2xl font-bold">{stats.quizCount}</div>
                    <div className="text-orange-100">Quizzes</div>
                </Card>
            </div>

            {/* Performance Analytics */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Student Performance Analytics</h2>
                <Card>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignments Submitted</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment Score</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quizzes Attempted</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz Score</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {analytics.map((student) => (
                                    <tr key={student.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.assignmentsSubmitted}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.assignmentScore}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.quizzesAttempted}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.quizScore}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* My Courses */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold">My Courses</h2>
                        <Button onClick={() => navigate('/teacher/courses/new')}>Create Course</Button>
                    </div>
                    {courses.length === 0 ? (
                        <Card>
                            <p className="text-gray-500">You haven't created any courses yet.</p>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {courses.map((course) => (
                                <Card
                                    key={course._id}
                                    onClick={() => navigate(`/teacher/courses/${course._id}/manage`)}
                                    className="cursor-pointer hover:border-primary-300"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-lg">{course.title}</h3>
                                            <p className="text-sm text-gray-600 mt-1">{course.department}</p>
                                        </div>
                                        <span className={`badge ${course.isPublished ? 'badge-success' : 'badge-warning'}`}>
                                            {course.isPublished ? 'Published' : 'Draft'}
                                        </span>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Announcements */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Recent Announcements</h2>
                    {announcements.length === 0 ? (
                        <Card>
                            <p className="text-gray-500">No announcements yet.</p>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {announcements.map((announcement) => (
                                <Card key={announcement._id}>
                                    <h3 className="font-semibold">{announcement.title}</h3>
                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{announcement.message}</p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        {new Date(announcement.createdAt).toLocaleDateString()}
                                    </p>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
