import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Signin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/signin`,
        formData,
        {
          withCredentials: true,
        }
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("shopNames", JSON.stringify(res.data.shopNames));
      toast.success("Signed In Successfully!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Error signing in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-5 bg-gray-50">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-blue-200">
          <CardHeader className="space-y-2 pb-5">
            <CardTitle className="text-2xl font-bold text-center">
              Sign In
            </CardTitle>
            <CardDescription className="text-center text-black">
              Enter your details to access your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="bg-red-100 border-2 border-red-100 rounded-lg p-2 pl-5">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
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
                    className="absolute inset-y-0 right-0 flex items-center pr-3 "
                  >
                    {showPassword ? (
                      <FiEye size={18} />
                    ) : (
                      <FiEyeOff size={18} />
                    )}
                  </button>
                </div> 
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, rememberMe: checked })
                    }
                    className="border-blue-300"
                  />
                  <label htmlFor="rememberMe" className="text-sm">
                    Remember me
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-md h-4 w-4"></div>
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6">
              <div className="text-center">
                <p className="text-sm">
                  Don't have an account?{" "}
                  <button
                    onClick={() => navigate("/signup")}
                    className="text-black font-bold  hover:text-blue-700"
                  >
                    SignUp
                  </button>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signin;
