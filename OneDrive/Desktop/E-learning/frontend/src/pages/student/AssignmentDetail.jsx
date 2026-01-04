import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export default function AssignmentDetail() {
    const { assignmentId } = useParams();
    const [assignment, setAssignment] = useState(null);
    const [content, setContent] = useState('');
    const [fileUrl, setFileUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAssignment();
    }, [assignmentId]);

    const fetchAssignment = async () => {
        try {
            const response = await api.get(`/api/assignments/${assignmentId}`);
            setAssignment(response.data);
            if (response.data.submission) {
                setContent(response.data.submission.content || '');
                setFileUrl(response.data.submission.fileUrl || '');
            }
        } catch (error) {
            console.error('Error fetching assignment:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await api.post(`/api/assignments/${assignmentId}/submit`, {
                content,
                fileUrl,
            });
            alert('Assignment submitted successfully!');
            fetchAssignment(); // Refresh to show submission
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to submit assignment');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    if (!assignment) {
        return <div>Assignment not found</div>;
    }

    const isOverdue = new Date(assignment.dueDate) < new Date();

    return (
        <div>
            <button
                onClick={() => navigate('/student/assignments')}
                className="text-primary-600 hover:text-primary-700 mb-4"
            >
                ← Back to Assignments
            </button>

            <Card className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{assignment.title}</h1>
                <div className="flex flex-wrap gap-4 mb-4">
                    <div>
                        <strong>Course:</strong> {assignment.course?.title}
                    </div>
                    <div>
                        <strong>Due Date:</strong>{' '}
                        <span className={isOverdue ? 'text-red-600 font-semibold' : ''}>
                            {new Date(assignment.dueDate).toLocaleString()}
                        </span>
                    </div>
                    <div>
                        <strong>Max Marks:</strong> {assignment.maxMarks}
                    </div>
                </div>
                {isOverdue && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                        <p className="text-red-700 text-sm">⚠️ This assignment is overdue</p>
                    </div>
                )}
                <div className="prose max-w-none">
                    <h3>Description:</h3>
                    <p>{assignment.description}</p>
                </div>
            </Card>

            {/* Submission Section */}
            {assignment.submission && assignment.submission.marks !== null ? (
                <Card>
                    <h2 className="text-2xl font-semibold mb-4">Graded Submission</h2>
                    <div className="space-y-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="text-xl font-bold text-green-700">
                                Score: {assignment.submission.marks}/{assignment.maxMarks}
                            </div>
                        </div>
                        {assignment.submission.feedback && (
                            <div>
                                <h3 className="font-semibold mb-2">Teacher Feedback:</h3>
                                <p className="text-gray-700">{assignment.submission.feedback}</p>
                            </div>
                        )}
                        <div>
                            <h3 className="font-semibold mb-2">Your Submission:</h3>
                            <p className="text-gray-700 whitespace-pre-wrap">{assignment.submission.content}</p>
                            {assignment.submission.fileUrl && (
                                <a
                                    href={assignment.submission.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary-600 hover:text-primary-700 mt-2 inline-block"
                                >
                                    📎 View Submitted File
                                </a>
                            )}
                        </div>
                    </div>
                </Card>
            ) : (
                <Card>
                    <h2 className="text-2xl font-semibold mb-4">Submit Assignment</h2>
                    {assignment.submission && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                            <p className="text-blue-700 text-sm">
                                You have already submitted this assignment. You can update your submission below.
                            </p>
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Answer/Content
                            </label>
                            <textarea
                                className="input-field min-h-[200px]"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Type your answer here..."
                                required
                            />
                        </div>

                        <Input
                            label="File URL (optional)"
                            type="text"
                            value={fileUrl}
                            onChange={(e) => setFileUrl(e.target.value)}
                            placeholder="https://example.com/myfile.pdf"
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            disabled={submitting || !content.trim()}
                        >
                            {submitting ? 'Submitting...' : assignment.submission ? 'Update Submission' : 'Submit Assignment'}
                        </Button>
                    </form>
                </Card>
            )}
        </div>
    );
}
