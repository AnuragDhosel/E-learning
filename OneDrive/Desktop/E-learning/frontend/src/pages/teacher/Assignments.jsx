import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function TeacherAssignments() {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            // This endpoint needs to be created in backend
            const res = await api.get('/api/assignments/my-assignments-teacher');
            setAssignments(res.data);
        } catch (error) {
            console.error('Error fetching assignments:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">All Assignments</h1>
                <Button onClick={() => navigate('/teacher/courses')}>
                    + Add Assignment
                </Button>
            </div>

            {assignments.length === 0 ? (
                <Card>
                    <p className="text-gray-500">No assignments created yet. Create one from your course management page.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {assignments.map((assignment) => (
                        <Card key={assignment._id}>
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{assignment.title}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{assignment.description}</p>
                                    <div className="flex items-center gap-4 mt-3 text-sm">
                                        <span className="text-gray-500">
                                            📚 {assignment.course?.title}
                                        </span>
                                        <span className={`font-medium ${new Date(assignment.dueDate) < new Date()
                                                ? 'text-red-600'
                                                : 'text-green-600'
                                            }`}>
                                            📅 Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                        </span>
                                        <span className="text-gray-500">
                                            Max Marks: {assignment.maxMarks}
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    onClick={() => navigate(`/teacher/courses/${assignment.course._id}/manage`)}
                                >
                                    Manage
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
