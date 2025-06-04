import { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router';
import axios from 'axios';
import Loader from '../loader/Loader';
import { toast } from 'react-hot-toast';

function ShopDashboard({ setUser, loading, setLoading }) {
  const [shopLoading, setShopLoading] = useState(true);
  const [shopName, setShopName] = useState(null);
  const [error, setError] = useState(null);
  const { shopName: paramShopName } = useParams();

  // console.log('ShopDashboard mounted with param:', paramShopName);

  useEffect(() => {
    const validateShop = async () => {
      try {
        setShopLoading(true);
        setLoading(true);

        // Determine shop name from URL (subdomain or path)
        const hostname = window.location.hostname;
        const subdomain = hostname.split('.')[0];
        const targetShopName = paramShopName || (hostname !== 'localhost' && !hostname.includes('127.0.0.1') ? subdomain : null);
        // console.log('Target shop name:', targetShopName, 'Hostname:', hostname, 'Param:', paramShopName);

        if (!targetShopName) {
          setShopName(null);
          return;
        }

        // Validate token
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/validate-token`,
          { withCredentials: true }
        );
        // console.log('Validate token response:', response.data);

        if (!response.data.valid) {
          throw new Error(response.data.message || 'Invalid token');
        }

        setUser(response.data.user);

        // Check if shop name is valid
        if (!response.data.user.shopNames.includes(targetShopName)) {
          throw new Error(`Invalid shop name: ${targetShopName}`);
        }

        setShopName(targetShopName);
      } catch (err) {
        console.error('Shop validation error:', err.response || err);
        setError(err.message || 'Failed to load shop dashboard');
        toast.error(err.message || 'Failed to load shop dashboard');
      } finally {
        setShopLoading(false);
        setLoading(false);
      }
    };

    validateShop();
  }, [paramShopName, setUser, setLoading]);

  if (shopLoading || loading) {
    return <Loader />;
  }

  if (error) {
    return <Navigate to="/signin" replace />;
  }

  if (!shopName) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="text-center p-5">
      <h1 className="text-2xl font-bold">This is {shopName} shop</h1>
    </div>
  );
}

export default ShopDashboard;