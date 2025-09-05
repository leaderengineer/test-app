import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import Auth from "../components/Auth";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { currentUser, isAdmin, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  const handleLogout = () => {
    if (currentUser) {
      // Foydalanuvchi tizimga kirgan bo'lsa, logout qilish
      logout();
    } else {
      // Foydalanuvchi tizimga kirmagan bo'lsa, auth oynasini ko'rsatish
      setShowAuth(true);
    }
  };

  const handleProfileClick = () => {
    if (currentUser) {
      navigate("/profile");
    } else {
      setShowAuth(true);
    }
  };

  const handleAdminPanelClick = () => {
    if (currentUser && isAdmin()) {
      navigate("/admin");
    } else {
      setShowAuth(true);
    }
  };

  const handleTestSolving = () => {
    if (currentUser) {
      navigate("/test-selection");
    } else {
      setShowAuth(true);
    }
  };

  return (
    <div className="home-container">
      {/* Background Animation */}
      <div className="background-animation">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
      </div>

      {/* Header with Theme Toggle and Account */}
      <div className="home-header">
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        <button className="account-btn" onClick={handleLogout}>
          {currentUser ? (
            <div className="user-info">
              <span className="user-avatar">🚪</span>
              <span className="user-name">Chiqish</span>
            </div>
          ) : (
            <div className="account-info">
              <span className="account-icon">🔐</span>
              <span className="account-text">Account</span>
            </div>
          )}
        </button>
      </div>

      {/* Main Content */}
      <div className="home-content">
        <div className="hero-section animate-fade-in-up">
          <h1 className="main-title">
            <span className="gradient-text">Test App</span>
          </h1>
          <p className="subtitle">
            Bilimingizni sinab ko'ring va yangi bilimlarni o'zlashtiring
          </p>
        </div>

        <div className="action-buttons animate-scale-in">
          {currentUser ? (
            // Tizimga kirgan foydalanuvchilar uchun
            <>
              <button
                className="action-btn profile-btn animate-bounce-in"
                onClick={handleProfileClick}
              >
                <span className="btn-icon">👤</span>
                <span className="btn-text">Profil</span>
                <div className="btn-glow"></div>
              </button>

              {isAdmin() ? (
                // Admin uchun Admin Panel tugmasi
                <button
                  className="action-btn admin-btn animate-bounce-in"
                  onClick={handleAdminPanelClick}
                >
                  <span className="btn-icon">⚙️</span>
                  <span className="btn-text">Admin Panel</span>
                  <div className="btn-glow"></div>
                </button>
              ) : (
                // Oddiy userlar uchun Test Yechish tugmasi
                <button
                  className="action-btn test-btn animate-bounce-in"
                  onClick={handleTestSolving}
                >
                  <span className="btn-icon">📝</span>
                  <span className="btn-text">Test Yechish</span>
                  <div className="btn-glow"></div>
                </button>
              )}
            </>
          ) : (
            // Tizimga kirmagan foydalanuvchilar uchun
            <>
              <button
                className="action-btn login-btn animate-bounce-in"
                onClick={() => setShowAuth(true)}
              >
                <span className="btn-icon">🔐</span>
                <span className="btn-text">Tizimga kirish</span>
                <div className="btn-glow"></div>
              </button>

              <button
                className="action-btn test-btn animate-bounce-in"
                onClick={handleTestSolving}
              >
                <span className="btn-icon">📝</span>
                <span className="btn-text">Test Yechish</span>
                <div className="btn-glow"></div>
              </button>
            </>
          )}
        </div>

        {/* Features Section */}
        <div className="features-section animate-fade-in-up">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Aniq Natijalar</h3>
            <p>Har bir test natijasi aniq hisoblanadi</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Tezkor Ishlash</h3>
            <p>Zamonaviy texnologiyalar bilan yaratilgan</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Responsive Dizayn</h3>
            <p>Barcha qurilmalarda ishlaydi</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="home-footer animate-fade-in-up">
        <p>&copy; 2025 Test App. Barcha huquqlar himoyalangan.</p>
      </footer>

      {/* Auth Modal */}
      {showAuth && <Auth onClose={() => setShowAuth(false)} />}
    </div>
  );
};

export default Home;
