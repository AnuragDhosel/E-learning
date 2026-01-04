import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/common/Card';

export default function LectureView() {
    const { courseId, lectureId } = useParams();
    const [lecture, setLecture] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchLecture();
    }, [lectureId]);

    const fetchLecture = async () => {
        try {
            const response = await api.get(`/api/lectures/${lectureId}`);
            setLecture(response.data);
        } catch (error) {
            console.error('Error fetching lecture:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    if (!lecture) {
        return <div>Lecture not found</div>;
    }

    return (
        <div>
            <button
                onClick={() => navigate(`/student/courses/${courseId}`)}
                className="text-primary-600 hover:text-primary-700 mb-4"
            >
                ← Back to Course
            </button>

            <h1 className="text-3xl font-bold text-gray-900 mb-6">{lecture.title}</h1>

            {lecture.description && (
                <p className="text-gray-600 mb-6">{lecture.description}</p>
            )}

            {/* Video Section */}
            {lecture.videoUrl && (
                <Card className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Lecture Video</h2>
                    <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                        {lecture.videoUrl.includes('youtube.com') || lecture.videoUrl.includes('youtu.be') ? (
                            <iframe
                                className="w-full h-full"
                                src={lecture.videoUrl.replace('watch?v=', 'embed/')}
                                title={lecture.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-white">
                                <div className="text-center">
                                    <p className="mb-2">Video URL:</p>
                                    <a
                                        href={lecture.videoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-300 hover:text-primary-200 underline"
                                    >
                                        {lecture.videoUrl}
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
            )}

            {/* Lecture Notes */}
            {lecture.notes && (
                <Card className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Lecture Notes</h2>
                    <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: lecture.notes }}
                    />
                </Card>
            )}

            {/* Resources */}
            {lecture.resources && lecture.resources.length > 0 && (
                <Card>
                    <h2 className="text-xl font-semibold mb-4">Resources</h2>
                    <div className="space-y-2">
                        {lecture.resources.map((resource, index) => (
                            <a
                                key={index}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <span className="text-primary-600 hover:text-primary-700">
                                    📎 {resource.name}
                                </span>
                            </a>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
}
