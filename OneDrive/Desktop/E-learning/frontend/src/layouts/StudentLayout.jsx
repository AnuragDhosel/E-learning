import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';

export default function StudentLayout() {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const navigation = [
        { name: 'Dashboard', path: '/student/dashboard', icon: '📊' },
        { name: 'Courses', path: '/student/courses', icon: '📚' },
        { name: 'Assignments', path: '/student/assignments', icon: '📝' },
        { name: 'Quizzes', path: '/student/quizzes', icon: '✏️' },
        { name: 'Coding Practice', path: '/student/coding', icon: '💻' },
        { name: 'Announcements', path: '/student/announcements', icon: '📢' },
        { name: 'Profile', path: '/student/profile', icon: '👤' },
        { name: 'Settings', path: '/student/settings', icon: '⚙️' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex">
                {/* Sidebar */}
                <aside
                    className={`bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] sticky top-16 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'
                        }`}
                >
                    <div className="p-4 flex justify-end">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                        >
                            {isSidebarOpen ? '◀' : '▶'}
                        </button>
                    </div>
                    <nav className="px-4 space-y-1">
                        {navigation.map((item) => {
                            const isActive = location.pathname.startsWith(item.path);
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-primary-50 text-primary-700 font-medium'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    title={!isSidebarOpen ? item.name : ''}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    {isSidebarOpen && <span>{item.name}</span>}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main content */}
                <main className="flex-1 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
