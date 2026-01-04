export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-primary-600">404</h1>
                <h2 className="text-3xl font-semibold text-gray-900 mt-4">Page Not Found</h2>
                <p className="text-gray-600 mt-2">The page you're looking for doesn't exist.</p>
                <a
                    href="/"
                    className="inline-block mt-6 bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700"
                >
                    Go Back Home
                </a>
            </div>
        </div>
    );
}
