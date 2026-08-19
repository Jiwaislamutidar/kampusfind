import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import FindPage from './pages/FindPage';
import FormHilangPage from './pages/FormHilangPage';
import FormDitemukanPage from './pages/FormDitemukanPage';
import DetailPage from './pages/DetailPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import SuccessPage from "./pages/SuccessPage"; // sesuaikan path nya

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />

      <Navbar />

      <main className="flex-1">
        <Routes>

          {/* Halaman utama */}
          <Route path="/" element={<HomePage />} />

          {/* Temukan barang */}
          <Route path="/temukan" element={<FindPage />} />

          {/* Form laporan */}
          <Route
            path="/lapor/hilang"
            element={<FormHilangPage />}
          />

          <Route
            path="/lapor/ditemukan"
            element={<FormDitemukanPage />}
          />

          {/* Detail barang */}
          <Route
            path="/barang/:id"
            element={<DetailPage />}
          />

          {/* Login admin */}
          <Route
            path="/login/admin"
            element={<LoginPage />}
          />

          <Route path="/lapor-sukses" element={<SuccessPage />} />

          {/* Admin */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/admin"
              element={<AdminPage />}
            />

          </Route>

        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;