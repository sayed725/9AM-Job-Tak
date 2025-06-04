import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import toast from "react-hot-toast";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    shopNames: ["", "", "", ""],
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const shops = formData.shopNames.filter((name) => name.trim() !== "");
    if (shops.length < 3 || shops.length > 5) {
      setError("Please provide 3–5 shop names");
      setIsLoading(false);
      return;
    }

    // Check for duplicate shop
    const uniqueShops = new Set(shops.map(name => name.toLowerCase()));
    if (uniqueShops.size !== shops.length) {
      setError("Shop names must be unique");
      setIsLoading(false);
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, {
        username: formData.username,
        password: formData.password,
        shops,
      });
      navigate("/signin");
      toast.success("Account created successfully! Please sign in.");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error signing up");
    } finally {
      setIsLoading(false);
    }
  };

  const addShopField = () => {
    if (formData.shopNames.length < 5) {
      setFormData({
        ...formData,
        shopNames: [...formData.shopNames, ""],
      });
    }
  };

  const removeShopField = (index) => {
    if (formData.shopNames.length > 3) {
      const newShops = formData.shopNames.filter((_, i) => i !== index);
      setFormData({ ...formData, shopNames: newShops });
    }
  };

  const filledShops = formData.shopNames.filter((name) => name.trim() !== "").length;

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-gray-50">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-blue-200">
          <CardHeader className="space-y-2 pb-5">
            <CardTitle className="text-2xl font-bold text-center">
              Sign Up
            </CardTitle>
            <CardDescription className="text-center text-black">
              Enter details to create your account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="bg-red-100 border-2 border-red-100 rounded-lg p-2 pl-5">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* User Credentials Section */}
              <div className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Your Username"
                    className="pl-5 h-10 border-blue-200"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Your Password"
                    className="pl-5 h-10 border-blue-200"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                  </button>
                </div>
              </div>

              {/* Shop Names Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Enter Your Shop Names</h3>
                  <Badge
                    variant={filledShops >= 3 ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {filledShops}/3 required
                  </Badge>
                </div>

                <div className="space-y-3">
                  {formData.shopNames.map((shop, i) => (
                    <div key={i} className="relative group">
                      <Input
                        type="text"
                        placeholder={`Shop ${i + 1} Name`}
                        className="pl-5 h-10 border-blue-200"
                        value={shop}
                        onChange={(e) => {
                          const newShops = [...formData.shopNames];
                          newShops[i] = e.target.value;
                          setFormData({ ...formData, shopNames: newShops });
                        }}
                        required={i < 3}
                      />
                      {i >= 3 && (
                        <button
                          type="button"
                          onClick={() => removeShopField(i)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 rounded-full bg-red-100 text-red-500 hover:bg-red-200"
                        >
                          <RxCross2 className="h-3 w-3 mx-auto" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {formData.shopNames.length < 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addShopField}
                    className="w-full border-dashed border-2 h-10 text-gray-600 hover:text-gray-900 hover:border-blue-400"
                  >
                    <FaPlus className="w-4 h-4 mr-2" />
                    Add Another Shop
                  </Button>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-md h-4 w-4"></div>
                    Creating An Account...
                  </div>
                ) : (
                  "Create An Account"
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/signin")}
                  className="text-black font-bold hover:text-blue-700"
                >
                  Sign In
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;