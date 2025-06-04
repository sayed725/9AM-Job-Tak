import { useState } from 'react';
import { 
  // useLocation,
   useNavigate } from 'react-router';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

function Dashboard({ user, setUser, setLoading }) {
  const [showShops, setShowShops] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const navigate = useNavigate();
  // const location=useLocation()

  // console.log(location.pathname)
  

  const handleLogout = async () => {
    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
      setUser(null);
      navigate('/signin');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleShopClick = (shopName) => {
    window.location.href = `http://${shopName}.${import.meta.env.VITE_SHOP_URL}`;
    // window.location.href = `http://${shopName}.localhost:5173`;
  };

  return (
    <div className="p-5 max-w-7xl mx-auto">
      <div className="flex justify-between  gap-3">
        <h1 className="text-2xl font-bold">Welcome, {user.username}</h1>
        <Button
          onClick={() => setShowShops(!showShops)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Profile
        </Button>
      </div>

      {showShops && (
        <div className="mt-5">
          <h2 className="text-xl font-semibold">Your Shops:</h2>
          <ul className="mt-2 space-y-2">
            {user.shopNames.map((shop) => (
              <li key={shop}>
                <Button
                  variant="outline"
                  onClick={() => handleShopClick(shop)}
                  className="w-full text-left"
                >
                  {shop}
                </Button>
              </li>
            ))}
          </ul>
          <Dialog open={openLogoutDialog} onOpenChange={setOpenLogoutDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="mt-3">
                Logout
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Logout</DialogTitle>
                <DialogDescription>
                  Are you sure you want to log out?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setOpenLogoutDialog(false)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleLogout}>
                  Logout
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}

export default Dashboard;