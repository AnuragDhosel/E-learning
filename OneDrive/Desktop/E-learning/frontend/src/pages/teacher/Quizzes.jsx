import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function TeacherQuizzes() {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const res = await api.get('/api/quizzes/my-quizzes');
            setQuizzes(res.data);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">All Quizzes</h1>
                <Button onClick={() => navigate('/teacher/courses')}>
                    + Add Quiz
                </Button>
            </div>

            {quizzes.length === 0 ? (
                <Card>
                    <p className="text-gray-500">No quizzes created yet. Create one from your course management page.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {quizzes.map((quiz) => (
                        <Card key={quiz._id}>
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-lg">{quiz.title}</h3>
                                        <span className={`badge ${quiz.isPublished ? 'badge-success' : 'badge-warning'}`}>
                                            {quiz.isPublished ? 'Published' : 'Draft'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{quiz.description}</p>
                                    <div className="flex items-center gap-4 mt-3 text-sm">
                                        <span className="text-gray-500">
                                            📚 {quiz.course?.title}
                                        </span>
                                        <span className="text-gray-500">
                                            ⏱️ {quiz.timeLimit} minutes
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    onClick={() => navigate(`/teacher/courses/${quiz.course._id}/manage`)}
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
