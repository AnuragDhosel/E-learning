import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function StudentQuizzes() {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const res = await api.get('/api/quizzes/my-attempts');
            setQuizzes(res.data);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    const pendingQuizzes = quizzes.filter(q => !q.attempted);
    const completedQuizzes = quizzes.filter(q => q.attempted);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Quizzes</h1>

            <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                    <span className="mr-2">📝</span> Pending Quizzes
                </h2>
                {pendingQuizzes.length === 0 ? (
                    <Card>
                        <p className="text-gray-500">No pending quizzes. Great job!</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pendingQuizzes.map((quiz) => (
                            <Card key={quiz._id} className="border-l-4 border-l-yellow-500">
                                <h3 className="font-semibold text-lg mb-1">{quiz.title}</h3>
                                <p className="text-sm text-gray-600 mb-2">{quiz.course?.title}</p>
                                <p className="text-sm text-gray-500 mb-4">{quiz.description}</p>
                                <div className="flex justify-between items-center mt-auto">
                                    <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded">
                                        ⏱️ {quiz.timeLimit} mins
                                    </span>
                                    <Button onClick={() => navigate(`/student/quizzes/${quiz._id}`)}>
                                        Start Quiz
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                    <span className="mr-2">✅</span> Completed Quizzes
                </h2>
                {completedQuizzes.length === 0 ? (
                    <Card>
                        <p className="text-gray-500">You haven't completed any quizzes yet.</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {completedQuizzes.map((quiz) => (
                            <Card key={quiz._id} className="border-l-4 border-l-green-500">
                                <h3 className="font-semibold text-lg mb-1">{quiz.title}</h3>
                                <p className="text-sm text-gray-600 mb-2">{quiz.course?.title}</p>
                                <div className="mt-4 p-3 bg-green-50 rounded-lg flex justify-between items-center">
                                    <span className="text-sm font-medium text-green-800">Score</span>
                                    <span className="text-xl font-bold text-green-700">
                                        {quiz.score} / {quiz.questions?.length || '?'}
                                    </span>
                                </div>
                                <Button
                                    variant="secondary"
                                    className="w-full mt-4"
                                    onClick={() => navigate(`/student/quizzes/${quiz._id}`)} // Re-visit to see results
                                >
                                    View Results
                                </Button>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
