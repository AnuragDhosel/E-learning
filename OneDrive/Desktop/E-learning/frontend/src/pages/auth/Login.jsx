import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function Login() {
    const [activeTab, setActiveTab] = useState('student');
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const userData = await login(formData);
            // Navigate based on role
            if (userData.role === 'student') {
                navigate('/student/dashboard');
            } else if (userData.role === 'teacher') {
                navigate('/teacher/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        // Optional: Clear form or pre-fill with demo credentials
        if (tab === 'student') {
            setFormData({ email: 'ankit.mehra@student.edu', password: 'password123' });
        } else {
            setFormData({ email: 'rahul.sharma@university.edu', password: 'password123' });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
                    <p className="text-gray-600 mt-2">Sign in to your account</p>
                </div>

                {/* Tabs */}
                <div className="flex mb-6 border-b border-gray-200">
                    <button
                        className={`flex-1 py-2 text-center font-medium ${activeTab === 'student'
                                ? 'text-primary-600 border-b-2 border-primary-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => handleTabChange('student')}
                    >
                        Student
                    </button>
                    <button
                        className={`flex-1 py-2 text-center font-medium ${activeTab === 'teacher'
                                ? 'text-primary-600 border-b-2 border-primary-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => handleTabChange('teacher')}
                    >
                        Teacher
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <Input
                        label={activeTab === 'student' ? "Student Email" : "Teacher Email"}
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder={activeTab === 'student' ? "ankit.mehra@student.edu" : "rahul.sharma@university.edu"}
                    />

                    <Input
                        label="Password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="••••••••"
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : `Sign In as ${activeTab === 'student' ? 'Student' : 'Teacher'}`}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                            Register here
                        </Link>
                    </p>
                    <Link to="/" className="block mt-4 text-gray-500 hover:text-gray-700 text-sm">
                        ← Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
}
