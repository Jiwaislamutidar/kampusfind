import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

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
    <nav className={`navbar-fixed z-50 px-4 py-3 font-sans antialiased sm:px-6 sm:py-4 ${isHome ? "navbar-home" : "bg-[var(--color-paper)]"}`}>
      <div className={`navbar-shell mx-auto flex max-w-6xl items-center ${isOpen ? "navbar-shell-open" : ""}`}>
        <Link to="/" className="navbar-brand shrink-0 text-xl font-bold tracking-tight text-indigo-600 hover:opacity-90">
          <img src="/favicon.svg" alt="" className="h-7 w-7" />
          <span>KampusFind</span>
        </Link>

        <div className="navbar-menu-wrap">
          <div
            id="mobile-navigation"
            className={`navbar-menu ${isOpen ? "navbar-menu-open" : ""}`}
            aria-hidden={!isOpen}
          >
            <div className="navbar-links">
              <Link to="/" onClick={() => setIsOpen(false)} className="navbar-link">Beranda</Link>
              <Link to="/temukan" onClick={() => setIsOpen(false)} className="navbar-link">Cari Barang</Link>
              <Link to="/lapor/hilang" onClick={() => setIsOpen(false)} className="navbar-link">Lapor Hilang</Link>
              <Link to="/lapor/ditemukan" onClick={() => setIsOpen(false)} className="navbar-link">Lapor Ditemukan</Link>
              {isAdmin ? (
                <>
                  <Link to="/admin" onClick={() => setIsOpen(false)} className="navbar-link navbar-link-accent">Dashboard Admin</Link>
                  <button onClick={() => { setIsOpen(false); handleLogout(); }} className="navbar-link navbar-link-danger">Logout</button>
                </>
              ) : (
                <Link to="/login/admin" onClick={() => setIsOpen(false)} className="navbar-link navbar-link-accent">Login Admin</Link>
              )}
            </div>
          </div>

          <div className="navbar-controls">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="navbar-toggle"
              aria-label="Toggle Menu"
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
            >
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M0 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6 6 18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}