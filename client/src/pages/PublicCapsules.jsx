import { useState, useEffect } from 'react';
import { capsuleAPI } from '../services/api';
import CapsuleCard from '../components/CapsuleCard';
import toast from 'react-hot-toast';

const PublicCapsules = () => {
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicCapsules();
  }, []);

  const fetchPublicCapsules = async () => {
    try {
      console.log('🌍 Fetching public capsules...');
      const response = await capsuleAPI.getPublic();
      console.log('✅ Public capsules loaded:', response.data.length);
      setCapsules(response.data);
    } catch (error) {
      console.error('❌ Failed to load public capsules:', error.response?.data || error.message);
      toast.error('Failed to load public capsules');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🌍 Public Time Capsules</h1>
          <p className="text-xl text-gray-600">
            Explore memories shared by the community
          </p>
        </div>

        {/* Capsules Grid */}
        {capsules.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No public capsules yet</h3>
            <p className="text-gray-600">
              Be the first to share your memories with the world!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capsules.map(capsule => (
              <CapsuleCard
                key={capsule._id}
                capsule={capsule}
                showOwner={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicCapsules;
