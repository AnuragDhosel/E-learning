import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function ManageCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await api.get('/api/courses/my-courses');
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const togglePublish = async (courseId, currentStatus) => {
        try {
            await api.put(`/api/courses/${courseId}`, { isPublished: !currentStatus });
            fetchCourses();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update course');
        }
    };

    const deleteCourse = async (courseId) => {
        if (!confirm('Are you sure you want to delete this course?')) return;

        try {
            await api.delete(`/api/courses/${courseId}`);
            fetchCourses();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete course');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Manage Courses</h1>
                <Button onClick={() => navigate('/teacher/courses/new')}>Create New Course</Button>
            </div>

            {courses.length === 0 ? (
                <Card>
                    <p className="text-gray-500">You haven't created any courses yet.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <Card key={course._id}>
                            <div className="mb-4">
                                <span className={`badge ${course.isPublished ? 'badge-success' : 'badge-warning'}`}>
                                    {course.isPublished ? 'Published' : 'Draft'}
                                </span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                            <div className="text-sm text-gray-700 mb-4">
                                <p><strong>Department:</strong> {course.department}</p>
                                {course.semester && <p><strong>Semester:</strong> {course.semester}</p>}
                            </div>
                            <div className="flex flex-col space-y-2">
                                <Button
                                    variant="primary"
                                    className="w-full"
                                    onClick={() => navigate(`/teacher/courses/${course._id}/lectures`)}
                                >
                                    Manage Lectures
                                </Button>
                                <Button
                                    variant="secondary"
                                    className="w-full"
                                    onClick={() => togglePublish(course._id, course.isPublished)}
                                >
                                    {course.isPublished ? 'Unpublish' : 'Publish'}
                                </Button>
                                <Button
                                    variant="danger"
                                    className="w-full"
                                    onClick={() => deleteCourse(course._id)}
                                >
                                    Delete Course
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
