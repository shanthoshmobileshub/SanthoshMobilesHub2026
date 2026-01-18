import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

export default function Auth() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { login } = useAuth();

  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    // If we've been redirected here with a password to pre-fill (from the magic link)
    if (state?.prefillPass) {
      setMode("login");
      setForm((f) => ({ ...f, password: state.prefillPass }));
    }
  }, [state]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (mode === "login") {
      // Attempt admin login using the password.
      // The login function from context handles the secure check.
      if (login(form.password)) {
        navigate("/admin");
        return;
      }

      // ===== CUSTOMER LOGIN (DEMO) =====
      if (!form.email || !form.password) {
        setError("Invalid credentials. Please try again.");
        return;
      }
      // If password was not the admin pass, treat as customer
      alert(`Customer Logged in successfully!`);
      navigate("/");
    }

    // ===== CUSTOMER SIGNUP (DEMO) =====
    if (mode === "signup") {
      if (!form.name || !form.email || !form.password) {
        setError("All fields are required for sign up.");
        return;
      }
      alert(`Account created: ${form.name}`);
      navigate("/");
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-gray-50 py-12">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-4">
          {/* LEFT SIDE */}
          <div className="bg-gradient-to-br from-indigo-600 to-pink-500 text-white rounded-lg p-8 shadow-lg">
            <h2 className="text-3xl font-extrabold">Premium Access</h2>
            <p className="mt-4 text-sm opacity-90">
              Sign in to access exclusive deals, priority support, and buyback guarantees.
            </p>
            <ul className="mt-6 space-y-3">
              <li>• Priority Buyback</li>
              <li>• Exclusive Discounts</li>
              <li>• Extended Warranty Options</li>
            </ul>
            <div className="mt-6">
              <button className="bg-white text-indigo-600 px-4 py-2 rounded-full font-semibold">
                Learn More
              </button>
            </div>
          </div>

          {/* RIGHT SIDE FORM */}
          <div className="bg-white rounded-lg p-8 shadow">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">
                {mode === "login" ? "Welcome Back" : "Create Account"}
              </h3>
              <div className="text-sm text-gray-500">Secure • Fast • Trusted</div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setMode("login")}
                className={`flex-1 py-2 rounded ${
                  mode === "login" ? "bg-indigo-600 text-white" : "bg-gray-100"
                }`}
              >
                Login
              </button>

              <button
                onClick={() => setMode("signup")}
                className={`flex-1 py-2 rounded ${
                  mode === "signup" ? "bg-indigo-600 text-white" : "bg-gray-100"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <p className="mt-3 text-red-600 text-sm font-medium">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="text-sm font-medium">Full name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full mt-1 border rounded px-3 py-2"
                    placeholder="Your name"
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full mt-1 border rounded px-3 py-2"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Password</label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full mt-1 border rounded px-3 py-2"
                  placeholder="Enter password"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded"
              >
                {mode === "login" ? "Sign In" : "Create Account"}
              </button>
            </form>

            <div className="mt-4 text-center text-sm text-gray-500">
              or continue with
            </div>
            <div className="mt-3 flex gap-3">
              <button className="flex-1 border rounded py-2">Google</button>
              <button className="flex-1 border rounded py-2">Facebook</button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
