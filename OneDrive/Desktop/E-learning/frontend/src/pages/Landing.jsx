import { Link, useNavigate } from 'react-router-dom';

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-500 to-purple-600">
            <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-2xl font-bold text-white">E-Learning Platform</h1>
                        <div className="space-x-4">
                            <Link
                                to="/login"
                                className="text-white hover:text-gray-200 font-medium"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100"
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                        Welcome to University
                        <br />
                        E-Learning Platform
                    </h1>
                    <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                        Access courses, submit assignments, take quizzes, and practice coding problems all in one place.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={() => navigate('/register')}
                            className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 hover:scale-105 transition-all active:scale-95 shadow-xl"
                        >
                            Get Started
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/30 hover:scale-105 transition-all active:scale-95 border-2 border-white/50"
                        >
                            Sign In
                        </button>
                    </div>
                </div>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
                        <div className="text-4xl mb-4">📚</div>
                        <h3 className="text-xl font-semibold text-white mb-2">Access Courses</h3>
                        <p className="text-white/80">
                            Browse and enroll in courses taught by experienced professors.
                        </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
                        <div className="text-4xl mb-4">✏️</div>
                        <h3 className="text-xl font-semibold text-white mb-2">Take Quizzes</h3>
                        <p className="text-white/80">
                            Test your knowledge with interactive quizzes and get instant feedback.
                        </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
                        <div className="text-4xl mb-4">💻</div>
                        <h3 className="text-xl font-semibold text-white mb-2">Code Practice</h3>
                        <p className="text-white/80">
                            Solve coding problems and improve your programming skills.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
