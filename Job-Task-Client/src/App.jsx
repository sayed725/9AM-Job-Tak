import { BrowserRouter, Routes, Route, Navigate } from "react-router";
// import { useState, useEffect } from 'react';
// import axios from 'axios';
import Signup from "./components/auth/Signup";
import Signin from "./components/auth/Signin";
import Dashboard from "./components/dashboard/Dashboard";
import ShopDashboard from "./components/shopdashboard/ShopDashboard";

function App() {
  // const [user, setUser] = useState(null);
  // const [loading, setLoading] = useState(true);

  // // Check for authenticated user on app load
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/validate-token`, {
  //         withCredentials: true, // Send JWT cookie
  //       });
  //       setUser(response.data.user); // Set user data (e.g., { username, shops })
  //     } catch (err) {
  //       console.error('Failed to validate token', err);
  //       setUser(null); // No valid session
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUser();
  // }, []);

  // // Show loading UI during session check
  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-100">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
  //     </div>
  //   );
  // }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Navigate to="/signin" />} />
        <Route path="/:shopName" element={<ShopDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;