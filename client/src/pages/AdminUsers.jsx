import { useState, useEffect } from 'react';
import { adminAPI } from '../services/adminAPI';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, search, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search,
        status: statusFilter
      };
      const response = await adminAPI.getAllUsers(params);
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error(error.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId, currentStatus) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'unban' : 'ban'} this user?`)) return;

    try {
      await adminAPI.updateUser(userId, { action: currentStatus ? 'unban' : 'ban' });
      toast.success(`User ${currentStatus ? 'unbanned' : 'banned'} successfully`);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };

  const handleResetPassword = async (userId) => {
    if (!confirm('Are you sure you want to reset this user\'s password?')) return;

    try {
      const response = await adminAPI.updateUser(userId, { action: 'reset-password' });
      toast.success('Password reset successfully');
      alert(`Temporary Password: ${response.data.tempPassword}\n\nPlease share this with the user securely.`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This will also delete all their capsules. This action cannot be undone.')) return;

    try {
      await adminAPI.deleteUser(userId);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleViewDetails = async (userId) => {
    try {
      const response = await adminAPI.getUserById(userId);
      setSelectedUser(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load user details');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">User Management</h1>
        <p className="text-gray-600">View, search, and manage users</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">All Users</option>
            <option value="active">Active Only</option>
            <option value="banned">Banned Only</option>
          </select>
          <button
            onClick={fetchUsers}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Users Table */}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capsules</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.capsuleCount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        user.isBanned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {user.isBanned ? 'Banned' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleViewDetails(user._id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                      {user.role !== 'admin' && (
                        <>
                          <button
                            onClick={() => handleBanUser(user._id, user.isBanned)}
                            className={user.isBanned ? 'text-green-600 hover:text-green-900' : 'text-orange-600 hover:text-orange-900'}
                          >
                            {user.isBanned ? 'Unban' : 'Ban'}
                          </button>
                          <button
                            onClick={() => handleResetPassword(user._id)}
                            className="text-purple-600 hover:text-purple-900"
                          >
                            Reset
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </>
                      )}
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

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">User Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p><span className="font-medium">Name:</span> {selectedUser.user.name}</p>
                    <p><span className="font-medium">Email:</span> {selectedUser.user.email}</p>
                    <p><span className="font-medium">Role:</span> {selectedUser.user.role}</p>
                    <p><span className="font-medium">Status:</span> {selectedUser.user.isBanned ? 'Banned' : 'Active'}</p>
                    <p><span className="font-medium">Joined:</span> {new Date(selectedUser.user.createdAt).toLocaleString()}</p>
                    <p><span className="font-medium">Last Login:</span> {new Date(selectedUser.user.lastLogin).toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Statistics</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-blue-600">{selectedUser.stats.totalCapsules}</p>
                      <p className="text-sm text-gray-600">Total</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-yellow-600">{selectedUser.stats.lockedCapsules}</p>
                      <p className="text-sm text-gray-600">Locked</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-green-600">{selectedUser.stats.unlockedCapsules}</p>
                      <p className="text-sm text-gray-600">Unlocked</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Recent Capsules</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {selectedUser.capsules.map((capsule) => (
                      <div key={capsule._id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-800">{capsule.title}</p>
                          <p className="text-sm text-gray-500">
                            Unlock: {new Date(capsule.unlockDate).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          capsule.isUnlocked ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {capsule.isUnlocked ? 'Unlocked' : 'Locked'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
