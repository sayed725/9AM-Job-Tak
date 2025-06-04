import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import Loader from "../loader/Loader";


const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

//   console.log(user)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(res.data);
      } catch (err) {
        console.log(err);
        navigate("/signin");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

 const handleLogout = () => {
  toast(
    (t) => (
      <div className="flex gap-3 items-center">
        <div>
          <p>
            Are you <b>sure</b> you want to logout?
          </p>
        </div>
        <div className="gap-2 flex">
          <button
            className="bg-red-400 text-white px-3 py-1 rounded-md"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                toast.loading("Signing Out...", { position: "top-right" });
                await axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`);
                localStorage.removeItem("token");
                localStorage.removeItem("shopNames");
                navigate("/signin");
                toast.dismiss();
                toast.success(<b>Signed Out Successfully!</b>, { position: "top-right" });
              } catch (err) {
                toast.dismiss();
                toast.error(<b>{err.response?.data?.message || "Failed to sign out"}</b>, {
                  position: "top-right",
                  duration: 4000,
                });
              }
            }}
          >
            Yes
          </button>
          <button
            className="bg-green-400 text-white px-3 py-1 rounded-md"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      </div>
    ),
    {
      position: "top-right",
      style: {
        minWidth: "250px",
        borderRadius: "8px",
        background: "#fff",
        color: "#333",
      },
    }
  );
};
const handleShopClick = (shopName) => {
    window.location.href = `http://${shopName}.localhost:5173`;
  };

  if (loading) return <Loader/>

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Welcome, {user.username}</h1>
          <Button
            onClick={() => setShowProfile(!showProfile)}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Profile
          </Button>
        </div>
        {showProfile && (
          <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4">Your Shops</h2>
            <ul className="list-disc pl-6">
              {user.shopNames.map((shop, index) => (
                <li
                  key={index}
                  className="cursor-pointer text-blue-500 hover:underline"
                  onClick={() => handleShopClick(shop)}
                >
                  {shop}
                </li>
              ))}
            </ul>
            <Button
              onClick={handleLogout}
              variant={"destructive"}
              className={"mt-4 bg-red-500 hover:bg-red-600 text-white"}
            >
              Logout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;