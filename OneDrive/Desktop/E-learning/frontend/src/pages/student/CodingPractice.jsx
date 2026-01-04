import { useState, useEffect } from 'react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function CodingPractice() {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [code, setCode] = useState('');
    const [output, setOutput] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = async () => {
        try {
            const res = await api.get('/api/coding-problems');
            setProblems(res.data);
        } catch (error) {
            console.error('Error fetching coding problems:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedProblem) return;

        setSubmitting(true);
        try {
            const res = await api.post(`/api/coding-problems/${selectedProblem._id}/submit`, {
                code,
                language: 'javascript' // Default for now
            });
            setOutput(res.data);
        } catch (error) {
            setOutput({ status: 'Error', message: error.response?.data?.message || 'Submission failed' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="flex h-[calc(100vh-8rem)]">
            {/* Problem List Sidebar */}
            <div className="w-1/3 pr-6 overflow-y-auto border-r border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Coding Practice</h1>
                <div className="space-y-4">
                    {problems.map((problem) => (
                        <Card
                            key={problem._id}
                            className={`cursor-pointer transition-colors ${selectedProblem?._id === problem._id ? 'border-primary-500 ring-1 ring-primary-500' : 'hover:border-primary-300'}`}
                            onClick={() => {
                                setSelectedProblem(problem);
                                setCode('');
                                setOutput(null);
                            }}
                        >
                            <div className="flex justify-between items-start">
                                <h3 className="font-semibold">{problem.title}</h3>
                                <span className={`badge ${problem.difficulty === 'Easy' ? 'badge-success' :
                                        problem.difficulty === 'Medium' ? 'badge-warning' : 'badge-danger'
                                    }`}>
                                    {problem.difficulty}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{problem.statement}</p>
                            {problem.course && (
                                <p className="text-xs text-gray-500 mt-2">Course: {problem.course.title}</p>
                            )}
                        </Card>
                    ))}
                </div>
            </div>

            {/* Problem Workspace */}
            <div className="w-2/3 pl-6 flex flex-col h-full">
                {selectedProblem ? (
                    <>
                        <div className="mb-6 overflow-y-auto max-h-[40%]">
                            <h2 className="text-2xl font-bold mb-2">{selectedProblem.title}</h2>
                            <div className="prose max-w-none">
                                <p className="text-gray-700 mb-4">{selectedProblem.statement}</p>

                                <h3 className="font-semibold mt-4">Input Format</h3>
                                <p className="text-gray-600 text-sm">{selectedProblem.inputDescription}</p>

                                <h3 className="font-semibold mt-4">Output Format</h3>
                                <p className="text-gray-600 text-sm">{selectedProblem.outputDescription}</p>

                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    {selectedProblem.samples.map((sample, idx) => (
                                        <div key={idx} className="bg-gray-50 p-3 rounded">
                                            <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Sample Input {idx + 1}</div>
                                            <pre className="text-sm font-mono">{sample.input}</pre>
                                            <div className="text-xs font-semibold text-gray-500 uppercase mt-2 mb-1">Sample Output {idx + 1}</div>
                                            <pre className="text-sm font-mono">{sample.output}</pre>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex-grow flex flex-col">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold">Solution</h3>
                                <Button onClick={handleSubmit} disabled={submitting || !code}>
                                    {submitting ? 'Running...' : 'Run Code'}
                                </Button>
                            </div>
                            <textarea
                                className="flex-grow font-mono text-sm p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                placeholder="// Write your code here..."
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                        </div>

                        {output && (
                            <div className={`mt-4 p-4 rounded-lg ${output.status === 'Passed' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                                <h4 className={`font-bold ${output.status === 'Passed' ? 'text-green-800' : 'text-red-800'}`}>
                                    {output.status === 'Passed' ? '✅ Passed' : '❌ Failed'}
                                </h4>
                                <p className="text-sm mt-1">{output.message}</p>
                                {output.testCasesPassed !== undefined && (
                                    <p className="text-xs mt-2 font-mono">
                                        Test Cases: {output.testCasesPassed} / {output.totalTestCases}
                                    </p>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        Select a problem to start coding
                    </div>
                )}
            </div>
        </div>
    );
}
