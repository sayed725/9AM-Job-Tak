import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import toast from 'react-hot-toast';

function ShopDashboard({ user, setUser, loading, setLoading }) {
  const navigate = useNavigate();
  const [shopLoading, setShopLoading] = useState(true); // Local loading state for token verification

  // Get shop name from subdomain
  const shopName = window.location.hostname.split('.')[0];

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      setShopLoading(true);
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/validate-token`, {
          withCredentials: true, // Send JWT cookie
        });
        setUser(response.data.user); // Update user state
        // Verify shopName exists in user's shops
        if (!response.data.user.shops.includes(shopName)) {
          throw new Error('Unauthorized shop access');
        }
      } catch (err) {
        console.error('Token verification failed', err);
        setUser(null);
        toast.error(err.message || err.response?.data?.message || 'Session expired. Please sign in.');
        navigate('/signin');
      } finally {
        setShopLoading(false);
        setLoading(false);
      }
    };

    verifyToken();
  }, [setUser, setLoading, navigate, shopName]);

  // Show loading spinner
  if (shopLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  // Redirect to signin if no user
  if (!user) {
    return null; // Navigate handles redirect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md">
        <h1 className="text-2xl font-bold">This is {shopName} shop</h1>
      </div>
    </div>
  );
}

export default ShopDashboard;