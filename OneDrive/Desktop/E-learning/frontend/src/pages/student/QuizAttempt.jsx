import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function QuizAttempt() {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);

    useEffect(() => {
        fetchQuiz();
    }, [quizId]);

    const fetchQuiz = async () => {
        try {
            const res = await api.get(`/api/quizzes/${quizId}`);
            setQuiz(res.data);
        } catch (error) {
            console.error('Error fetching quiz:', error);
            alert('Failed to load quiz');
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (questionId, optionIndex) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionIndex
        }));
    };

    const handleSubmit = async () => {
        if (!confirm('Are you sure you want to submit?')) return;

        setSubmitting(true);
        try {
            // Transform answers to match backend expectation if needed
            // Assuming backend expects { answers: [{ questionId, selectedOption }] }
            const formattedAnswers = Object.entries(answers).map(([questionId, selectedOption]) => ({
                questionId,
                selectedOption
            }));

            const res = await api.post(`/api/quizzes/${quizId}/attempt`, { answers: formattedAnswers });
            setResult(res.data);
            alert(`Quiz submitted! Score: ${res.data.score}/${res.data.totalMarks}`);
        } catch (error) {
            console.error('Error submitting quiz:', error);
            alert(error.response?.data?.message || 'Failed to submit quiz');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading quiz...</div>;
    if (!quiz) return <div className="p-8 text-center">Quiz not found</div>;

    if (result) {
        return (
            <div className="max-w-3xl mx-auto p-4">
                <Card className="text-center p-8">
                    <h1 className="text-3xl font-bold mb-4">Quiz Results</h1>
                    <div className="text-6xl font-bold text-primary-600 mb-4">
                        {result.score} <span className="text-2xl text-gray-400">/ {result.totalMarks}</span>
                    </div>
                    <p className="text-xl mb-8">
                        You answered {result.correctAnswers} out of {result.totalQuestions} questions correctly.
                    </p>
                    <Button onClick={() => navigate(`/student/courses/${quiz.course}`)}>
                        Back to Course
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-4">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">{quiz.title}</h1>
                    <p className="text-gray-600">{quiz.description}</p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-500">Time Limit</div>
                    <div className="font-bold">{quiz.timeLimit} mins</div>
                </div>
            </div>

            <div className="space-y-6 mb-8">
                {quiz.questions.map((q, index) => (
                    <Card key={q._id}>
                        <h3 className="text-lg font-semibold mb-4">
                            {index + 1}. {q.question}
                        </h3>
                        <div className="space-y-2">
                            {q.options.map((option, optIndex) => (
                                <label
                                    key={optIndex}
                                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${answers[q._id] === optIndex
                                            ? 'border-primary-500 bg-primary-50'
                                            : 'border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name={`question-${q._id}`}
                                        className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                                        checked={answers[q._id] === optIndex}
                                        onChange={() => handleOptionSelect(q._id, optIndex)}
                                    />
                                    <span className="ml-3">{option}</span>
                                </label>
                            ))}
                        </div>
                    </Card>
                ))}
            </div>

            <div className="flex justify-end">
                <Button
                    variant="primary"
                    size="lg"
                    onClick={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? 'Submitting...' : 'Submit Quiz'}
                </Button>
            </div>
        </div>
    );
}
