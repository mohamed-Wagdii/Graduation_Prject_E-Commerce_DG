import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-9xl font-bold text-blue-600 mb-4">404</p>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Page Not Found</h1>
        <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/app" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            Go Home
          </Link>
          <Link to="/app/products" className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-semibold transition-colors">
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
