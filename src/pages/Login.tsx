import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "@/assets/grow.jpeg";
import hero from "@/assets/doctor.jpg";
import { Eye, EyeOff } from "lucide-react";
import API from "@/api/axios";
import { useAuth } from "@/lib/auth-context";
import { useDocumentTitle } from "@/lib/use-document-title";

export default function LoginPage() {
  useDocumentTitle("Login | GrowDoctor");
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      login(res.data.user, res.data.token);
      navigate("/profile");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Left Side */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center items-center bg-white p-12">

      <img
  src={logo}
  alt="GrowDoctor"
  className="h-36 w-36 object-contain mb-8 drop-shadow-lg"
/>

        <h1 className="text-5xl font-bold text-slate-800 text-center">
          Welcome to
          <br />
          GrowDoctor
        </h1>

        <p className="mt-5 text-xl text-gray-600 text-center">
          Empowering Healthcare Professionals
        </p>

        <img
          src={hero}
          className="w-[80%] mt-12 rounded-xl"
          alt=""
        />

      </div>

      {/* Right Side */}
      <div className="flex-1 flex justify-center items-center p-8">

        <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl p-10">

          <div className="flex justify-center gap-10 mb-8">

            <button className="border-b-4 border-green-600 pb-2 text-xl font-bold">
              LOGIN
            </button>

            <button
              onClick={() => window.location.href="/register"}
              className="text-xl text-gray-500 hover:text-green-600"
            >
              SIGN UP
            </button>

          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>

            {error && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span>⚠</span> {error}
              </p>
            )}

            <div>

              <label className="font-semibold">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="mt-2 w-full rounded-lg border p-3"
              />

            </div>

            <div>

              <label className="font-semibold">
                Password
              </label>

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                  className="mt-2 w-full rounded-lg border p-3"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-6"
                >
                  {showPassword ? (
                    <EyeOff size={20}/>
                  ) : (
                    <Eye size={20}/>
                  )}
                </button>

              </div>

            </div>

            <div className="flex justify-between text-sm">

              <label>

                <input type="checkbox"/>

                <span className="ml-2">
                  Remember Me
                </span>

              </label>

              <a
                href="#"
                className="text-green-700"
              >
                Forgot Password?
              </a>

            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-green-600 py-3 text-lg font-bold text-white hover:bg-green-700 disabled:opacity-60"
            >
              {submitting ? "Logging in..." : "Login"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}