import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Signup from './components/auth/Signup';
import Signin from './components/auth/Signin';
import Dashboard from './components/dashboard/Dashboard';
import ShopDashboard from './components/shopdashboard/ShopDashboard';
import Loader from './components/loader/Loader';
import { Toaster } from 'react-hot-toast';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/validate-token`, {
          withCredentials: true,
        });
        setUser(response.data.user);
      } catch (err) {
        console.error('Failed to validate token:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route
          path="/signup"
          element={<Signup user={user} setUser={setUser} setLoading={setLoading} />}
        />
        <Route
          path="/signin"
          element={<Signin user={user} setUser={setUser} setLoading={setLoading} />}
        />
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard
                user={user}
                setUser={setUser}
                loading={loading}
                setLoading={setLoading}
              />
            ) : (
              <Navigate to="/signin" replace />
            )
          }
        />
        <Route
          path="/shop/:shopName"
          element={
            user ? (
              <ShopDashboard
                user={user}
                setUser={setUser}
                loading={loading}
                setLoading={setLoading}
              />
            ) : (
              <Navigate to="/signin" replace />
            )
          }
        />
        <Route
          path="/"
          element={
            user ? (
              <ShopDashboard
                user={user}
                setUser={setUser}
                loading={loading}
                setLoading={setLoading}
              />
            ) : (
              <Navigate to="/signin" replace />
            )
          }
        />
        <Route path={`*.localhost:5173`} element={<ShopDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;