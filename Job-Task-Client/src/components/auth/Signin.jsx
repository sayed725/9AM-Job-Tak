import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
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
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";

function Signin({ setUser, setLoading }) {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      // eslint-disable-next-line no-unused-vars
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/signin`,
        data,
        { withCredentials: true }
      );
      // Fetch user data after sign-in to ensure user state is set
      const validateRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/validate-token`,
        { withCredentials: true }
      );
      setUser(validateRes.data.user);
       // Update with { username, shopNames }
      //  console.log(res.data);
      toast.success("Signed In Successfully!");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Error signing in");
    } finally {
      setLoading(false);
    }
  };

  // Redirect if already authenticated
  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/validate-token`,
          { withCredentials: true }
        );
        if (res.data.valid) {
          setUser(res.data.user);
          navigate("/dashboard", { replace: true });
        }
      } catch (err) {
        console.error("Check user error:", err);
      }
    };
    checkUser();
  }, [setUser, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-gray-50">
      <Card className="w-full max-w-md shadow-xl border-blue-200">
        <CardHeader className="space-y-2 pb-5">
          <CardTitle className="text-2xl font-bold text-center">
            Sign In
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Enter your details to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {Object.keys(errors).length > 0 && (
              <div className="bg-red-100 border border-red-500 rounded-lg p-3">
                <p className="text-red-600 text-sm">
                  {errors.username?.message ||
                    errors.password?.message ||
                    "Please fix the errors above"}
                </p>
              </div>
            )}
            <div className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Your Username"
                  className="h-10 border-blue-200"
                  {...register("username", {
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters",
                    },
                  })}
                />
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Your Password"
                  className="h-10 border-blue-200"
                  {...register("password", {
                    required: "Password is required",
                    pattern: {
                      value: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/,
                      message:
                        "Password must be 8+ characters with a number and special character",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  {...register("rememberMe")}
                  className="border-blue-300"
                />
                <label htmlFor="rememberMe" className="text-sm">
                  Remember me
                </label>
              </div>
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-all duration-200"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-600 font-semibold hover:text-blue-700"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Signin;