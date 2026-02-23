import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Preserve Your Memories for the Future
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-purple-100 px-4">
              Create digital time capsules that unlock automatically on your chosen date
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
              {isAuthenticated ? (
                <Link to="/dashboard" className="bg-white text-purple-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-gray-100 transition">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="bg-white text-purple-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-gray-100 transition">
                    Get Started Free
                  </Link>
                  <Link to="/public" className="bg-purple-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-purple-900 transition">
                    View Public Capsules
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-16 text-gray-800">
          Why Choose TimeCapsule?
        </h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center p-6 sm:p-8 rounded-xl bg-white shadow-lg hover:shadow-2xl transition">
            <div className="text-5xl sm:text-6xl mb-4">🔒</div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800">Secure & Encrypted</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Your memories are protected with AES-256 encryption. Only you can access them when the time comes.
            </p>
          </div>

          <div className="text-center p-6 sm:p-8 rounded-xl bg-white shadow-lg hover:shadow-2xl transition">
            <div className="text-5xl sm:text-6xl mb-4">⏰</div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800">Automatic Unlocking</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Set a future date and forget about it. We'll automatically unlock your capsule and notify you via email.
            </p>
          </div>

          <div className="text-center p-6 sm:p-8 rounded-xl bg-white shadow-lg hover:shadow-2xl transition">
            <div className="text-5xl sm:text-6xl mb-4">📸</div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800">Rich Media Support</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Store text messages, photos, videos, and audio recordings. Preserve memories in any format.
            </p>
          </div>

          <div className="text-center p-6 sm:p-8 rounded-xl bg-white shadow-lg hover:shadow-2xl transition">
            <div className="text-5xl sm:text-6xl mb-4">🌍</div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800">Share Publicly</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Choose to make your capsules public after unlocking. Share your memories with the world.
            </p>
          </div>

          <div className="text-center p-6 sm:p-8 rounded-xl bg-white shadow-lg hover:shadow-2xl transition">
            <div className="text-5xl sm:text-6xl mb-4">📧</div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800">Email Notifications</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Get notified instantly when your time capsule unlocks. Never miss the moment.
            </p>
          </div>

          <div className="text-center p-6 sm:p-8 rounded-xl bg-white shadow-lg hover:shadow-2xl transition">
            <div className="text-5xl sm:text-6xl mb-4">⏳</div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800">Countdown Timers</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Watch the countdown in real-time. Build anticipation as your unlock date approaches.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-12 sm:py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">
            Start Preserving Your Memories Today
          </h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-purple-100">
            Create your first time capsule in minutes. It's free and easy to get started.
          </p>
          {!isAuthenticated && (
            <Link to="/register" className="bg-white text-purple-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-gray-100 transition inline-block">
              Create Free Account
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
