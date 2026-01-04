import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function CourseDetails() {
    const { courseId } = useParams();
    const [activeTab, setActiveTab] = useState('content');
    const [course, setCourse] = useState(null);
    const [lectures, setLectures] = useState([]);
    const [notes, setNotes] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [codingProblems, setCodingProblems] = useState([]);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourseDetails();
    }, [courseId]);

    const fetchCourseDetails = async () => {
        try {
            const [courseRes, lecturesRes, enrollmentRes, notesRes, assignmentsRes, quizzesRes, codingProblemsRes] = await Promise.all([
                api.get(`/api/courses/${courseId}`),
                api.get(`/api/lectures/course/${courseId}`),
                api.get(`/api/courses/${courseId}/enrollment-status`),
                api.get(`/api/courses/${courseId}/notes`),
                api.get(`/api/assignments/course/${courseId}`),
                api.get(`/api/assignments/course/${courseId}`),
                api.get(`/api/quizzes/course/${courseId}`),
                api.get(`/api/coding-problems?courseId=${courseId}`)
            ]);

            setCourse(courseRes.data);
            setLectures(lecturesRes.data);
            setIsEnrolled(enrollmentRes.data.isEnrolled);
            setNotes(notesRes.data);
            setAssignments(assignmentsRes.data);
            setQuizzes(quizzesRes.data);
            setCodingProblems(codingProblemsRes.data);
        } catch (error) {
            console.error('Error fetching course details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async () => {
        try {
            await api.post(`/api/courses/${courseId}/enroll`);
            setIsEnrolled(true);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to enroll');
        }
    };

    const handleUnenroll = async () => {
        if (!confirm('Are you sure you want to unenroll from this course?')) return;

        try {
            await api.delete(`/api/courses/${courseId}/enroll`);
            setIsEnrolled(false);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to unenroll');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    if (!course) {
        return <div>Course not found</div>;
    }

    return (
        <div>
            <button
                onClick={() => navigate('/student/courses')}
                className="text-primary-600 hover:text-primary-700 mb-4"
            >
                ← Back to Courses
            </button>

            <Card className="mb-8">
                <div className="flex justify-between items-start">
                    <div className="flex-grow">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
                        <p className="text-gray-600 mb-4">{course.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                            <div>
                                <strong>Teacher:</strong> {course.teacher?.name}
                            </div>
                            <div>
                                <strong>Department:</strong> {course.department}
                            </div>
                            {course.semester && (
                                <div>
                                    <strong>Semester:</strong> {course.semester}
                                </div>
                            )}
                        </div>
                        {course.tags && course.tags.length > 0 && (
                            <div className="mt-4 flex gap-2">
                                {course.tags.map((tag, index) => (
                                    <span key={index} className="badge badge-info">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="ml-4">
                        {isEnrolled ? (
                            <Button variant="danger" onClick={handleUnenroll}>
                                Unenroll
                            </Button>
                        ) : (
                            <Button variant="primary" onClick={handleEnroll}>
                                Enroll Now
                            </Button>
                        )}
                    </div>
                </div>
            </Card>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    className={`px-6 py-3 font-medium ${activeTab === 'content' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('content')}
                >
                    Course Content
                </button>
                <button
                    className={`px-6 py-3 font-medium ${activeTab === 'notes' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('notes')}
                >
                    Notes
                </button>
                <button
                    className={`px-6 py-3 font-medium ${activeTab === 'assignments' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('assignments')}
                >
                    Assignments
                </button>
                <button
                    className={`px-6 py-3 font-medium ${activeTab === 'quizzes' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('quizzes')}
                >
                    Quizzes
                </button>
                <button
                    className={`px-6 py-3 font-medium ${activeTab === 'coding' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('coding')}
                >
                    Coding
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'content' && (
                <div className="space-y-4">
                    {lectures.length === 0 ? (
                        <Card><p className="text-gray-500">No lectures available yet.</p></Card>
                    ) : (
                        lectures.map((lecture, index) => (
                            <Card
                                key={lecture._id}
                                onClick={() => navigate(`/student/courses/${courseId}/lecture/${lecture._id}`)}
                                className="cursor-pointer hover:border-primary-300"
                            >
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-semibold mr-4">
                                        {index + 1}
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="font-semibold text-lg">{lecture.title}</h3>
                                        {lecture.description && <p className="text-sm text-gray-600 mt-1">{lecture.description}</p>}
                                        {lecture.videoUrl && <span className="badge badge-success mt-2">📹 Video Available</span>}
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'notes' && (
                <div className="space-y-4">
                    {notes.length === 0 ? (
                        <Card><p className="text-gray-500">No notes available yet.</p></Card>
                    ) : (
                        notes.map((note) => (
                            <Card key={note._id}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-lg">{note.title}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{note.content}</p>
                                    </div>
                                    <span className="badge badge-info uppercase">{note.type}</span>
                                </div>
                                {note.fileUrl && (
                                    <a href={note.fileUrl} target="_blank" rel="noreferrer" className="inline-block mt-3 text-primary-600 hover:underline">
                                        View/Download Resource →
                                    </a>
                                )}
                            </Card>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'assignments' && (
                <div className="space-y-4">
                    {assignments.length === 0 ? (
                        <Card><p className="text-gray-500">No assignments available yet.</p></Card>
                    ) : (
                        assignments.map((assignment) => (
                            <Card key={assignment._id}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-lg">{assignment.title}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{assignment.description}</p>
                                        <p className="text-xs text-gray-500 mt-2">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                                    </div>
                                    <Button onClick={() => navigate(`/student/assignments/${assignment._id}`)}>
                                        View Details
                                    </Button>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'quizzes' && (
                <div className="space-y-4">
                    {quizzes.length === 0 ? (
                        <Card><p className="text-gray-500">No quizzes available yet.</p></Card>
                    ) : (
                        quizzes.map((quiz) => (
                            <Card key={quiz._id}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-lg">{quiz.title}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{quiz.description}</p>
                                        <p className="text-xs text-gray-500 mt-2">Time Limit: {quiz.timeLimit} mins</p>
                                    </div>
                                    <Button onClick={() => navigate(`/student/quizzes/${quiz._id}`)}>
                                        Start Quiz
                                    </Button>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'coding' && (
                <div className="space-y-4">
                    {codingProblems.length === 0 ? (
                        <Card><p className="text-gray-500">No coding problems available yet.</p></Card>
                    ) : (
                        codingProblems.map((problem) => (
                            <Card key={problem._id}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-lg">{problem.title}</h3>
                                        <span className={`badge ${problem.difficulty === 'Easy' ? 'badge-success' :
                                                problem.difficulty === 'Medium' ? 'badge-warning' : 'badge-danger'
                                            } mt-1`}>
                                            {problem.difficulty}
                                        </span>
                                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{problem.statement}</p>
                                    </div>
                                    <Button onClick={() => navigate('/student/coding')}>
                                        Solve
                                    </Button>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
