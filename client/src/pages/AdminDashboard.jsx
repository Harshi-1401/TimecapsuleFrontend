import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/adminAPI';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error(error.response?.data?.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center text-red-600">Failed to load statistics</div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'bg-blue-500' },
    { label: 'Active Users', value: stats.activeUsers, icon: '✅', color: 'bg-green-500' },
    { label: 'Banned Users', value: stats.bannedUsers, icon: '🚫', color: 'bg-red-500' },
    { label: 'Total Capsules', value: stats.totalCapsules, icon: '📦', color: 'bg-purple-500' },
    { label: 'Locked Capsules', value: stats.lockedCapsules, icon: '🔒', color: 'bg-yellow-500' },
    { label: 'Unlocked Capsules', value: stats.unlockedCapsules, icon: '🔓', color: 'bg-teal-500' },
    { label: 'Reported Capsules', value: stats.reportedCapsules, icon: '⚠️', color: 'bg-orange-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">System overview and statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`${stat.color} text-white text-3xl p-3 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link to="/admin/users" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">User Management</h3>
              <p className="text-gray-600">View, search, ban, and manage users</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </Link>

        <Link to="/admin/capsules" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Capsule Moderation</h3>
              <p className="text-gray-600">Review, filter, and moderate capsules</p>
            </div>
            <div className="text-4xl">📦</div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">User Registrations (Last 6 Months)</h3>
          <div className="space-y-2">
            {stats.userRegistrations && stats.userRegistrations.length > 0 ? (
              stats.userRegistrations.map((item, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-gray-600 w-24">
                    {new Date(item._id.year, item._id.month - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 ml-4">
                    <div className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2" style={{ width: `${(item.count / Math.max(...stats.userRegistrations.map(i => i.count))) * 100}%` }}>
                      <span className="text-white text-xs font-semibold">{item.count}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No data available</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Capsule Creations (Last 6 Months)</h3>
          <div className="space-y-2">
            {stats.capsuleCreations && stats.capsuleCreations.length > 0 ? (
              stats.capsuleCreations.map((item, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-gray-600 w-24">
                    {new Date(item._id.year, item._id.month - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 ml-4">
                    <div className="bg-purple-500 h-6 rounded-full flex items-center justify-end pr-2" style={{ width: `${(item.count / Math.max(...stats.capsuleCreations.map(i => i.count))) * 100}%` }}>
                      <span className="text-white text-xs font-semibold">{item.count}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
