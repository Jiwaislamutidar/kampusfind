import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Fungsi submit yang terhubung ke Backend Express & MySQL/phpMyAdmin
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Pengecekan: Wajib centang Remember Me sebelum diproses
    if (!remember) {
      setError("Silakan centang Remember Me terlebih dahulu.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("adminLoggedIn", "true");
        navigate("/admin");
      } else {
        setError(data.message || "Email atau password salah.");
      }
    } catch (err) {
      setError("Gagal terhubung ke server. Pastikan backend berjalan.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-[#f5f7fa] px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-153px)] max-w-md flex-col justify-center">
       
        {/* Login Card */}
        <div className="rounded-lg border border-gray-200 bg-white px-9 py-7 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">

          {/* Icon */}
          <div className="mb-3 flex justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4f46e5]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 3L19 6V11C19 15.5 16.1 19.5 12 21C7.9 19.5 5 15.5 5 11V6L12 3Z"
                  fill="white"
                  fillOpacity="0.9"
                />

                <rect
                  x="9"
                  y="10"
                  width="6"
                  height="5"
                  rx="1"
                  fill="#4f46e5"
                />

                <path
                  d="M10.5 10V8.8C10.5 7.97 11.17 7.3 12 7.3C12.83 7.3 13.5 7.97 13.5 8.8V10"
                  stroke="#4f46e5"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <div className="mb-8 text-center">
            <h1 className="text-[21px] font-bold text-[#4338ca]">
              SecureAdmin
            </h1>

            <p className="mt-1 text-[12px] text-gray-700">
              Admin Login
            </p>

            <p className="mx-auto mt-2 max-w-[270px] text-[12px] leading-4 text-gray-600">
              Please enter your credentials to access the dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="mb-1 block text-[12px] font-medium text-gray-800"
              >
                Email Address
              </label>

              <div className="relative">
                {/* Email Icon */}
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="1.5"
                    stroke="#374151"
                    strokeWidth="1.8"
                  />

                  <path
                    d="M4 7L12 13L20 7"
                    stroke="#374151"
                    strokeWidth="1.8"
                  />
                </svg>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-9 w-full border border-[#d8d5e8] bg-white pl-9 pr-3 text-[13px] text-gray-700 outline-none transition focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5]"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="mb-1 block text-[12px] font-medium text-gray-800"
              >
                Password
              </label>

              <div className="relative">

                {/* Password Icon */}
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <rect
                    x="5"
                    y="10"
                    width="14"
                    height="10"
                    rx="1.5"
                    stroke="#374151"
                    strokeWidth="1.8"
                  />

                  <path
                    d="M8 10V7.5C8 5.29 9.79 3.5 12 3.5C14.21 3.5 16 5.29 16 7.5V10"
                    stroke="#374151"
                    strokeWidth="1.8"
                  />

                  <circle
                    cx="12"
                    cy="15"
                    r="1.2"
                    fill="#374151"
                  />
                </svg>

                {/* Password Input */}
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-9 w-full border border-[#d8d5e8] bg-white pl-9 pr-10 text-[13px] text-gray-700 outline-none transition focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5]"
                  placeholder="Enter your password"
                  required
                />

                {/* Show / Hide Password */}
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-[#4f46e5]"
                  aria-label={
                    showPassword
                      ? "Sembunyikan password"
                      : "Tampilkan password"
                  }
                >
                  {showPassword ? (
                    /* Eye Open */
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M2.5 12C4.2 8.5 7.6 6 12 6C16.4 6 19.8 8.5 21.5 12C19.8 15.5 16.4 18 12 18C7.6 18 4.2 15.5 2.5 12Z"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      />

                      <circle
                        cx="12"
                        cy="12"
                        r="2.5"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      />
                    </svg>
                  ) : (
                    /* Eye Closed */
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M3 3L21 21"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                      />

                      <path
                        d="M10.6 6.2C11.05 6.07 11.52 6 12 6C16.4 6 19.8 8.5 21.5 12C20.75 13.55 19.7 14.85 18.4 15.8"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                      />

                      <path
                        d="M6.1 8.1C4.6 9.05 3.4 10.35 2.5 12C4.2 15.5 7.6 18 12 18C13.1 18 14.15 17.8 15.1 17.45"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="mb-4 text-center text-[12px] text-red-500">
                {error}
              </p>
            )}

          {/* Remember Me */}
          <div className="mb-4 flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600 select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
              />
              Remember Me
            </label>
          </div>

          {/* Tombol Sign In */}
          <button
            type="submit"
            className="h-9 w-full text-[12px] font-semibold text-white bg-[#4f46e5] hover:bg-[#4338ca] transition rounded-md cursor-pointer"
          >
            Sign In
          </button>
                    </form>
                  </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-[10px] text-gray-700">
          <div className="flex justify-center gap-4">
            <button className="hover:text-[#4338ca]">
              Privacy Policy
            </button>

            <button className="hover:text-[#4338ca]">
              Terms of Service
            </button>

            <button className="hover:text-[#4338ca]">
              Security Architecture
            </button>
          </div>

          <p className="mt-2">
            © 2026 KampusFind. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}