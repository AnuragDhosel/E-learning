import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function StudentCourses() {
    const [courses, setCourses] = useState([]);
    const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const [allCoursesRes, enrolledRes] = await Promise.all([
                api.get('/api/courses'),
                api.get('/api/courses/enrolled'),
            ]);

            setCourses(allCoursesRes.data);
            setEnrolledCourseIds(new Set(enrolledRes.data.map(c => c._id)));
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async (courseId) => {
        try {
            await api.post(`/api/courses/${courseId}/enroll`);
            setEnrolledCourseIds(prev => new Set([...prev, courseId]));
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to enroll');
        }
    };

    const handleUnenroll = async (courseId) => {
        if (!confirm('Are you sure you want to unenroll from this course?')) return;

        try {
            await api.delete(`/api/courses/${courseId}/enroll`);
            setEnrolledCourseIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(courseId);
                return newSet;
            });
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to unenroll');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Courses</h1>

            {courses.length === 0 ? (
                <Card>
                    <p className="text-gray-500">No courses available at the moment.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => {
                        const isEnrolled = enrolledCourseIds.has(course._id);
                        return (
                            <Card key={course._id} className="flex flex-col">
                                <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                                <p className="text-sm text-gray-600 mb-3 flex-grow line-clamp-2">
                                    {course.description}
                                </p>
                                <div className="mb-3">
                                    <p className="text-sm text-gray-700">
                                        <strong>Teacher:</strong> {course.teacher?.name}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        <strong>Department:</strong> {course.department}
                                    </p>
                                    {course.semester && (
                                        <span className="badge badge-info mt-2">{course.semester}</span>
                                    )}
                                </div>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="primary"
                                        className="flex-1"
                                        onClick={() => navigate(`/student/courses/${course._id}`)}
                                    >
                                        View Details
                                    </Button>
                                    {isEnrolled ? (
                                        <Button
                                            variant="danger"
                                            onClick={() => handleUnenroll(course._id)}
                                        >
                                            Unenroll
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="secondary"
                                            onClick={() => handleEnroll(course._id)}
                                        >
                                            Enroll
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
