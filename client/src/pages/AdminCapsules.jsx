import { useState, useEffect } from 'react';
import { adminAPI } from '../services/adminAPI';
import toast from 'react-hot-toast';

const AdminCapsules = () => {
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchCapsules();
  }, [currentPage, filter]);

  const fetchCapsules = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        filter
      };
      const response = await adminAPI.getAllCapsules(params);
      setCapsules(response.data.capsules);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching capsules:', error);
      toast.error(error.response?.data?.message || 'Failed to load capsules');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCapsule = async (capsuleId) => {
    if (!confirm('Are you sure you want to delete this capsule? This action cannot be undone.')) return;

    try {
      await adminAPI.deleteCapsule(capsuleId);
      toast.success('Capsule deleted successfully');
      fetchCapsules();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete capsule');
    }
  };

  const handleReviewCapsule = async (capsuleId) => {
    try {
      await adminAPI.reviewCapsule(capsuleId);
      toast.success('Capsule marked as reviewed');
      fetchCapsules();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to review capsule');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Capsule Moderation</h1>
        <p className="text-gray-600">Review, filter, and moderate capsules</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">All Capsules</option>
            <option value="locked">Locked Only</option>
            <option value="unlocked">Unlocked Only</option>
            <option value="reported">Reported Only</option>
          </select>
          <button
            onClick={fetchCapsules}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Capsules Table */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visibility</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reports</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unlock Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {capsules.map((capsule) => (
                  <tr key={capsule._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{capsule.title}</div>
                      {capsule.message && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {capsule.message.substring(0, 50)}...
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{capsule.userId?.name || 'Unknown'}</div>
                      <div className="text-sm text-gray-500">{capsule.userId?.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        capsule.isUnlocked ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {capsule.isUnlocked ? 'Unlocked' : 'Locked'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        capsule.isPublic ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {capsule.isPublic ? 'Public' : 'Private'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {capsule.reportCount > 0 ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          {capsule.reportCount} report{capsule.reportCount > 1 ? 's' : ''}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(capsule.unlockDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {capsule.reportCount > 0 && !capsule.isReviewed && (
                        <button
                          onClick={() => handleReviewCapsule(capsule._id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Review
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteCapsule(capsule._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center space-x-4 mt-6">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminCapsules;
