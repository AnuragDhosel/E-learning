import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export default function Announcements() {
    const { user } = useAuth();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        audience: 'all',
        courseId: ''
    });

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const res = await api.get('/api/announcements');
            setAnnouncements(res.data);
        } catch (error) {
            console.error('Error fetching announcements:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/announcements', formData);
            alert('Announcement created successfully!');
            setShowForm(false);
            setFormData({ title: '', message: '', audience: 'all', courseId: '' });
            fetchAnnouncements();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create announcement');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this announcement?')) return;
        try {
            await api.delete(`/api/announcements/${id}`);
            fetchAnnouncements();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete announcement');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
                {user?.role === 'teacher' && (
                    <Button onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Cancel' : 'Create Announcement'}
                    </Button>
                )}
            </div>

            {/* Create Form (Teacher Only) */}
            {showForm && user?.role === 'teacher' && (
                <Card className="mb-8 bg-gray-50">
                    <h2 className="text-xl font-semibold mb-4">New Announcement</h2>
                    <form onSubmit={handleSubmit}>
                        <Input
                            label="Title"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                            <textarea
                                className="input-field"
                                rows="4"
                                required
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Audience</label>
                            <select
                                className="input-field"
                                value={formData.audience}
                                onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                            >
                                <option value="all">All</option>
                                <option value="students">Students Only</option>
                                <option value="teachers">Teachers Only</option>
                            </select>
                        </div>
                        <Button type="submit">Post Announcement</Button>
                    </form>
                </Card>
            )}

            {/* Announcements List */}
            <div className="space-y-4">
                {announcements.length === 0 ? (
                    <Card>
                        <p className="text-gray-500">No announcements yet.</p>
                    </Card>
                ) : (
                    announcements.map((announcement) => (
                        <Card key={announcement._id} className="border-l-4 border-l-primary-500">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-lg font-semibold">{announcement.title}</h3>
                                        <span className="badge badge-info uppercase text-xs">
                                            {announcement.audience}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 mb-3">{announcement.message}</p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span>👤 {announcement.createdBy?.name}</span>
                                        <span>📅 {new Date(announcement.createdAt).toLocaleDateString()}</span>
                                        {announcement.course && (
                                            <span>📚 {announcement.course.title}</span>
                                        )}
                                    </div>
                                </div>
                                {user?.role === 'teacher' && announcement.createdBy?._id === user._id && (
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDelete(announcement._id)}
                                    >
                                        Delete
                                    </Button>
                                )}
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
