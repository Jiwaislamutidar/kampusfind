import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loggedIn =
      localStorage.getItem("adminLoggedIn") === "true" ||
      sessionStorage.getItem("adminLoggedIn") === "true";
    setIsAdmin(loggedIn);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    sessionStorage.removeItem("adminLoggedIn");
    setIsAdmin(false);
    navigate("/login/admin");
  };

  return (
    <nav className="bg-white border-b border-slate-200 font-sans antialiased relative z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-tight text-indigo-600 hover:opacity-90">
          KampusFind
        </Link>

        {/* Tombol Hamburger */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-slate-600 rounded-lg hover:bg-slate-100 focus:outline-none transition-colors"
          aria-label="Toggle Menu"
        >
          {isOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Isi Hamburger Menu */}
      {isOpen && (
        <div className="bg-white border-b border-slate-200 px-6 pt-2 pb-5 space-y-1 text-sm font-medium">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block py-2.5 text-slate-700 hover:text-indigo-600 transition-colors border-b border-slate-100"
          >
            Beranda
          </Link>
          <Link
            to="/temukan"
            onClick={() => setIsOpen(false)}
            className="block py-2.5 text-slate-700 hover:text-indigo-600 transition-colors border-b border-slate-100"
          >
            Cari Barang
          </Link>
          <Link
            to="/lapor/hilang"
            onClick={() => setIsOpen(false)}
            className="block py-2.5 text-slate-700 hover:text-indigo-600 transition-colors border-b border-slate-100"
          >
            Lapor Hilang
          </Link>
          <Link
            to="/lapor/ditemukan"
            onClick={() => setIsOpen(false)}
            className="block py-2.5 text-slate-700 hover:text-indigo-600 transition-colors border-b border-slate-100"
          >
            Lapor Ditemukan
          </Link>

          {isAdmin ? (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="block py-2 font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Dashboard Admin
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full text-left py-2 text-red-600 hover:text-red-700 font-medium"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100">
              <Link
                to="/login/admin"
                onClick={() => setIsOpen(false)}
                className="block py-2 font-semibold text-indigo-600 hover::text-indigo-700"
              >
                Login Admin
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}