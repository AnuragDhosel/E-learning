import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function ManageLectures() {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [lectures, setLectures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        videoUrl: '',
        notes: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, [courseId]);

    const fetchData = async () => {
        try {
            const [courseRes, lecturesRes] = await Promise.all([
                api.get(`/api/courses/${courseId}`),
                api.get(`/api/lectures/course/${courseId}`),
            ]);
            setCourse(courseRes.data);
            setLectures(lecturesRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post('/api/lectures', {
                courseId,
                ...formData,
            });
            alert('Lecture created successfully!');
            setShowForm(false);
            setFormData({ title: '', description: '', videoUrl: '', notes: '' });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create lecture');
        }
    };

    const deleteLecture = async (lectureId) => {
        if (!confirm('Are you sure you want to delete this lecture?')) return;

        try {
            await api.delete(`/api/lectures/${lectureId}`);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete lecture');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    return (
        <div>
            <button
                onClick={() => navigate('/teacher/courses')}
                className="text-primary-600 hover:text-primary-700 mb-4"
            >
                ← Back to Courses
            </button>

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">{course?.title} - Lectures</h1>
                <Button onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : 'Add Lecture'}
                </Button>
            </div>

            {showForm && (
                <Card className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Create New Lecture</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                className="input-field"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                className="input-field"
                                rows="3"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                            <input
                                type="text"
                                className="input-field"
                                value={formData.videoUrl}
                                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                                placeholder="https://www.youtube.com/watch?v=..."
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Lecture Notes (HTML)</label>
                            <textarea
                                className="input-field min-h-[150px]"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="<h3>Topic</h3><p>Content...</p>"
                            />
                        </div>

                        <Button type="submit" variant="primary">Create Lecture</Button>
                    </form>
                </Card>
            )}

            {lectures.length === 0 ? (
                <Card>
                    <p className="text-gray-500">No lectures created yet.</p>
                </Card>
            ) : (
                <div className="space-y-4">
                    {lectures.map((lecture, index) => (
                        <Card key={lecture._id}>
                            <div className="flex justify-between items-start">
                                <div className="flex items-start flex-grow">
                                    <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-semibold mr-4">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold">{lecture.title}</h3>
                                        {lecture.description && (
                                            <p className="text-sm text-gray-600 mt-1">{lecture.description}</p>
                                        )}
                                        {lecture.videoUrl && (
                                            <span className="badge badge-success mt-2">📹 Video</span>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    variant="danger"
                                    onClick={() => deleteLecture(lecture._id)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
