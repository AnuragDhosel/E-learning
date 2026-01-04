import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export default function CourseManagement() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('lectures');
    const [course, setCourse] = useState(null);
    const [lectures, setLectures] = useState([]);
    const [notes, setNotes] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [codingProblems, setCodingProblems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form states
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchCourseData();
    }, [courseId]);

    const fetchCourseData = async () => {
        try {
            const [courseRes, lecturesRes, notesRes, assignmentsRes, quizzesRes, codingProblemsRes] = await Promise.all([
                api.get(`/api/courses/${courseId}`),
                api.get(`/api/lectures/course/${courseId}`),
                api.get(`/api/courses/${courseId}/notes`),
                api.get(`/api/assignments/course/${courseId}`),
                api.get(`/api/quizzes/course/${courseId}`),
                api.get(`/api/coding-problems?courseId=${courseId}`)
            ]);

            setCourse(courseRes.data);
            setLectures(lecturesRes.data);
            setNotes(notesRes.data);
            setAssignments(assignmentsRes.data);
            setQuizzes(quizzesRes.data);
            setCodingProblems(codingProblemsRes.data);
        } catch (error) {
            console.error('Error fetching course data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            let endpoint = '';
            let payload = { courseId, ...formData };

            if (activeTab === 'lectures') endpoint = '/api/lectures';
            if (activeTab === 'notes') endpoint = `/api/courses/${courseId}/notes`;
            if (activeTab === 'assignments') endpoint = '/api/assignments';
            if (activeTab === 'quizzes') endpoint = '/api/quizzes';
            if (activeTab === 'coding') endpoint = '/api/coding-problems';

            await api.post(endpoint, payload);

            alert(`${activeTab.slice(0, -1)} created successfully!`);
            setShowForm(false);
            setFormData({});
            fetchCourseData();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create item');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <button onClick={() => navigate('/teacher/courses')} className="text-primary-600 hover:underline mb-2">
                        ← Back to Courses
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">{course?.title}</h1>
                    <p className="text-gray-600">{course?.department}</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : `Add ${activeTab.slice(0, -1)}`}
                </Button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
                {['lectures', 'notes', 'assignments', 'quizzes', 'coding'].map((tab) => (
                    <button
                        key={tab}
                        className={`px-6 py-3 font-medium capitalize ${activeTab === tab
                            ? 'border-b-2 border-primary-600 text-primary-600'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => { setActiveTab(tab); setShowForm(false); }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Creation Form */}
            {showForm && (
                <Card className="mb-8 bg-gray-50">
                    <h2 className="text-xl font-semibold mb-4 capitalize">Add New {activeTab.slice(0, -1)}</h2>
                    <form onSubmit={handleCreate}>
                        <Input
                            label="Title"
                            required
                            value={formData.title || ''}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />

                        {activeTab !== 'notes' && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="input-field"
                                    rows="3"
                                    value={formData.description || ''}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        )}

                        {activeTab === 'lectures' && (
                            <>
                                <Input
                                    label="Video URL"
                                    value={formData.videoUrl || ''}
                                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                                    placeholder="https://youtube.com/..."
                                />
                            </>
                        )}

                        {activeTab === 'notes' && (
                            <>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Content / Description</label>
                                    <textarea
                                        className="input-field"
                                        rows="3"
                                        value={formData.content || ''}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    />
                                </div>
                                <Input
                                    label="File/Link URL"
                                    value={formData.fileUrl || ''}
                                    onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                                    placeholder="https://..."
                                />
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select
                                        className="input-field"
                                        value={formData.type || 'text'}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="text">Text</option>
                                        <option value="pdf">PDF</option>
                                        <option value="link">Link</option>
                                    </select>
                                </div>
                            </>
                        )}

                        {activeTab === 'assignments' && (
                            <>
                                <Input
                                    label="Due Date"
                                    type="date"
                                    required
                                    value={formData.dueDate || ''}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                />
                                <Input
                                    label="Max Marks"
                                    type="number"
                                    required
                                    value={formData.maxMarks || ''}
                                    onChange={(e) => setFormData({ ...formData, maxMarks: e.target.value })}
                                />
                            </>
                        )}

                        {activeTab === 'quizzes' && (
                            <>
                                <Input
                                    label="Time Limit (minutes)"
                                    type="number"
                                    required
                                    value={formData.timeLimit || ''}
                                    onChange={(e) => setFormData({ ...formData, timeLimit: e.target.value })}
                                />
                            </>
                        )}

                        {activeTab === 'coding' && (
                            <>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                                    <select
                                        className="input-field"
                                        value={formData.difficulty || 'Easy'}
                                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                    >
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Problem Statement</label>
                                    <textarea
                                        className="input-field"
                                        rows="4"
                                        required
                                        value={formData.statement || ''}
                                        onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
                                    />
                                </div>
                                {/* Simplified for demo - in real app would need complex inputs for samples */}
                                <Input
                                    label="Input Description"
                                    value={formData.inputDescription || ''}
                                    onChange={(e) => setFormData({ ...formData, inputDescription: e.target.value })}
                                />
                                <Input
                                    label="Output Description"
                                    value={formData.outputDescription || ''}
                                    onChange={(e) => setFormData({ ...formData, outputDescription: e.target.value })}
                                />
                            </>
                        )}

                        <Button type="submit">Create</Button>
                    </form>
                </Card>
            )}

            {/* List Content */}
            <div className="space-y-4">
                {activeTab === 'lectures' && lectures.map(item => (
                    <Card key={item._id}>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        {item.videoUrl && <a href={item.videoUrl} target="_blank" rel="noreferrer" className="text-blue-600 text-sm">Watch Video</a>}
                    </Card>
                ))}

                {activeTab === 'notes' && notes.map(item => (
                    <Card key={item._id}>
                        <div className="flex justify-between">
                            <div>
                                <h3 className="font-semibold">{item.title}</h3>
                                <p className="text-sm text-gray-600">{item.content}</p>
                            </div>
                            <span className="badge badge-info uppercase">{item.type}</span>
                        </div>
                        {item.fileUrl && <a href={item.fileUrl} target="_blank" rel="noreferrer" className="text-blue-600 text-sm block mt-2">View Resource</a>}
                    </Card>
                ))}

                {activeTab === 'assignments' && assignments.map(item => (
                    <Card key={item._id}>
                        <div className="flex justify-between">
                            <h3 className="font-semibold">{item.title}</h3>
                            <span className="text-sm text-gray-500">Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        <p className="text-xs text-gray-500 mt-1">Max Marks: {item.maxMarks}</p>
                    </Card>
                ))}

                {activeTab === 'quizzes' && quizzes.map(item => (
                    <Card key={item._id}>
                        <div className="flex justify-between">
                            <h3 className="font-semibold">{item.title}</h3>
                            <span className="text-sm text-gray-500">{item.timeLimit} mins</span>
                        </div>
                        <p className="text-sm text-gray-600">{item.description}</p>
                    </Card>
                ))}

                {activeTab === 'coding' && codingProblems.map(item => (
                    <Card key={item._id}>
                        <div className="flex justify-between">
                            <h3 className="font-semibold">{item.title}</h3>
                            <span className={`badge ${item.difficulty === 'Easy' ? 'badge-success' :
                                    item.difficulty === 'Medium' ? 'badge-warning' : 'badge-danger'
                                }`}>{item.difficulty}</span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{item.statement}</p>
                    </Card>
                ))}

                {/* Empty States */}
                {activeTab === 'lectures' && lectures.length === 0 && <p className="text-gray-500">No lectures yet.</p>}
                {activeTab === 'notes' && notes.length === 0 && <p className="text-gray-500">No notes yet.</p>}
                {activeTab === 'assignments' && assignments.length === 0 && <p className="text-gray-500">No assignments yet.</p>}
                {activeTab === 'quizzes' && quizzes.length === 0 && <p className="text-gray-500">No quizzes yet.</p>}
                {activeTab === 'coding' && codingProblems.length === 0 && <p className="text-gray-500">No coding problems yet.</p>}
            </div>
        </div>
    );
}
