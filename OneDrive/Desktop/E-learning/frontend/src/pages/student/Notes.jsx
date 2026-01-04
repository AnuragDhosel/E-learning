import { useState, useEffect } from 'react';
import api from '../../services/api';
import Card from '../../components/common/Card';

export default function StudentNotes() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const res = await api.get('/api/notes/my-notes');
            setNotes(res.data);
        } catch (error) {
            console.error('Error fetching notes:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    // Group notes by course
    const groupedNotes = notes.reduce((acc, note) => {
        const courseTitle = note.course?.title || 'Unknown Course';
        if (!acc[courseTitle]) {
            acc[courseTitle] = [];
        }
        acc[courseTitle].push(note);
        return acc;
    }, {});

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Notes</h1>

            {Object.keys(groupedNotes).length === 0 ? (
                <Card>
                    <p className="text-gray-500">No notes available.</p>
                </Card>
            ) : (
                Object.entries(groupedNotes).map(([courseTitle, courseNotes]) => (
                    <div key={courseTitle} className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-primary-700">{courseTitle}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courseNotes.map((note) => (
                                <Card key={note._id} className="h-full flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold text-lg">{note.title}</h3>
                                        <span className="badge badge-info uppercase text-xs">{note.type}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4 flex-grow">{note.content}</p>
                                    <div className="text-xs text-gray-500 mb-3">
                                        {new Date(note.createdAt).toLocaleDateString()}
                                    </div>
                                    {note.fileUrl && (
                                        <a
                                            href={note.fileUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-primary-600 hover:underline text-sm font-medium mt-auto"
                                        >
                                            View Resource →
                                        </a>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
