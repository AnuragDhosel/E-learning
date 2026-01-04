import { useState, useEffect } from 'react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function TeacherCodingProblems() {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = async () => {
        try {
            const res = await api.get('/api/coding-problems');
            setProblems(res.data);
        } catch (error) {
            console.error('Error fetching problems:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this problem?')) return;
        try {
            await api.delete(`/api/coding-problems/${id}`);
            setProblems(problems.filter(p => p._id !== id));
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete problem');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Coding Problems Library</h1>
                {/* Note: Creation is primarily done via Course Management, but could be added here too */}
            </div>

            {problems.length === 0 ? (
                <Card>
                    <p className="text-gray-500">No coding problems found. Create them within your courses.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {problems.map((problem) => (
                        <Card key={problem._id}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-lg">{problem.title}</h3>
                                        <span className={`badge ${problem.difficulty === 'Easy' ? 'badge-success' :
                                                problem.difficulty === 'Medium' ? 'badge-warning' : 'badge-danger'
                                            }`}>
                                            {problem.difficulty}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{problem.statement.substring(0, 150)}...</p>
                                    {problem.course && (
                                        <p className="text-xs text-gray-500">
                                            Linked to Course: <span className="font-medium">{problem.course.title}</span>
                                        </p>
                                    )}
                                </div>
                                <Button variant="danger" onClick={() => handleDelete(problem._id)}>
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
