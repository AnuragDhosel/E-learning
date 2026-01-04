import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function CourseForm() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        department: '',
        semester: '',
        tags: '',
        isPublished: false,
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const courseData = {
                ...formData,
                tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
            };
            await api.post('/api/courses', courseData);
            alert('Course created successfully!');
            navigate('/teacher/courses');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create course');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                onClick={() => navigate('/teacher/courses')}
                className="text-primary-600 hover:text-primary-700 mb-4"
            >
                ← Back to Courses
            </button>

            <Card>
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Course</h1>

                <form onSubmit={handleSubmit}>
                    <Input
                        label="Course Title"
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., Introduction to Web Development"
                    />

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            className="input-field min-h-[120px]"
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe what students will learn in this course..."
                        />
                    </div>

                    <Input
                        label="Department"
                        type="text"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        placeholder="e.g., Computer Science"
                    />

                    <Input
                        label="Semester"
                        type="text"
                        value={formData.semester}
                        onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                        placeholder="e.g., Fall 2024"
                    />

                    <Input
                        label="Tags (comma-separated)"
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        placeholder="e.g., web, frontend, javascript"
                    />

                    <div className="mb-6">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.isPublished}
                                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Publish immediately</span>
                        </label>
                    </div>

                    <div className="flex space-x-4">
                        <Button type="submit" variant="primary" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Course'}
                        </Button>
                        <Button type="button" variant="secondary" onClick={() => navigate('/teacher/courses')}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
