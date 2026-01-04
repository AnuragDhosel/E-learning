import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/common/Card';

export default function StudentAssignments() {
    const [assignments, setAssignments] = useState([]);
    const [filter, setFilter] = useState('all'); // all, pending, submitted, graded
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const response = await api.get('/api/assignments/my-assignments');
            setAssignments(response.data);
        } catch (error) {
            console.error('Error fetching assignments:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    const getFilteredAssignments = () => {
        switch (filter) {
            case 'pending':
                return assignments.filter(a => !a.submission);
            case 'submitted':
                return assignments.filter(a => a.submission && a.submission.marks === null);
            case 'graded':
                return assignments.filter(a => a.submission && a.submission.marks !== null);
            default:
                return assignments;
        }
    };

    const filteredAssignments = getFilteredAssignments();

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Assignments</h1>

            {/* Filter buttons */}
            <div className="flex space-x-2 mb-6">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg font-medium ${filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                >
                    All ({assignments.length})
                </button>
                <button
                    onClick={() => setFilter('pending')}
                    className={`px-4 py-2 rounded-lg font-medium ${filter === 'pending' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                >
                    Pending ({assignments.filter(a => !a.submission).length})
                </button>
                <button
                    onClick={() => setFilter('submitted')}
                    className={`px-4 py-2 rounded-lg font-medium ${filter === 'submitted' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                >
                    Submitted ({assignments.filter(a => a.submission && a.submission.marks === null).length})
                </button>
                <button
                    onClick={() => setFilter('graded')}
                    className={`px-4 py-2 rounded-lg font-medium ${filter === 'graded' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                >
                    Graded ({assignments.filter(a => a.submission && a.submission.marks !== null).length})
                </button>
            </div>

            {filteredAssignments.length === 0 ? (
                <Card>
                    <p className="text-gray-500">No assignments found.</p>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredAssignments.map((assignment) => (
                        <Card
                            key={assignment._id}
                            onClick={() => navigate(`/student/assignments/${assignment._id}`)}
                            className="cursor-pointer hover:border-primary-300"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-grow">
                                    <h3 className="text-lg font-semibold">{assignment.title}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{assignment.course?.title}</p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Due: {new Date(assignment.dueDate).toLocaleDateString()} at{' '}
                                        {new Date(assignment.dueDate).toLocaleTimeString()}
                                    </p>
                                    <p className="text-sm text-gray-500">Max Marks: {assignment.maxMarks}</p>
                                </div>
                                <div className="flex flex-col items-end space-y-2">
                                    {!assignment.submission ? (
                                        <span className="badge badge-warning">Not Submitted</span>
                                    ) : assignment.submission.marks !== null ? (
                                        <>
                                            <span className="badge badge-success">Graded</span>
                                            <div className="text-lg font-semibold text-green-600">
                                                {assignment.submission.marks}/{assignment.maxMarks}
                                            </div>
                                        </>
                                    ) : (
                                        <span className="badge badge-info">Submitted</span>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
