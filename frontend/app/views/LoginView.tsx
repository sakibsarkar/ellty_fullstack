import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useLoginUserMutation } from "redux/features/auth/auth.api";
import { toast } from "sonner";
import type { IQueryMutationErrorResponse } from "types/query";

const LoginView = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginUserMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading || !userName.trim() || !password.trim()) {
      return;
    }

    const res = await login({ userName, password });

    const error = res.error as IQueryMutationErrorResponse;

    if (error?.data?.message) {
      toast.error(error.data.message);
      return;
    }
    navigate("/");
  };
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        {/* Form Card */}
        <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label
                htmlFor="userName"
                className="block text-sm font-medium text-foreground mb-2"
              >
                User Name
              </label>
              <input
                id="userName"
                type="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="johndoe69"
                className="w-full px-4 py-2.5 bg-background border border-input rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2.5 bg-background border border-input rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              disabled={isLoading}
              type="submit"
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-md font-medium hover:opacity-90 transition disabled:bg-primary/10"
            >
              {isLoading ? ".Loading.." : "Sign In"}
            </button>
          </form>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center space-y-3">
          <p className="text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default LoginView;
