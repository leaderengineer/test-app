import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FaGoogle,
  FaGithub,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaEnvelope,
  FaLock,
  FaIdCard,
} from "react-icons/fa";
import "../styles/Auth.css";

const Auth = ({ onClose }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  const { signup, login, signInWithGoogle, signInWithGitHub, isAdmin } =
    useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!isLogin) {
      if (!formData.firstName || !formData.lastName) {
        setError("Barcha maydonlarni to'ldiring");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Parollar mos kelmadi");
        return false;
      }
      if (formData.password.length < 6) {
        setError("Parol kamida 6 ta belgidan iborat bo'lishi kerak");
        return false;
      }
    }
    if (!formData.email || !formData.password) {
      setError("Email va parolni kiriting");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        setSuccess("Muvaffaqiyatli kirdingiz!");

        // Admin yoki oddiy user bo'lishiga qarab yo'naltirish
        setTimeout(() => {
          onClose();
          if (isAdmin()) {
            navigate("/admin");
          } else {
            navigate("/test-selection");
          }
        }, 1500);
      } else {
        await signup(formData.email, formData.password, {
          firstName: formData.firstName,
          lastName: formData.lastName,
        });
        setSuccess("Muvaffaqiyatli ro'yxatdan o'tdingiz!");
        
        // Ro'yxatdan o'tgandan keyin tegishli sahifaga yo'naltirish
        setTimeout(() => {
          onClose();
          if (isAdmin()) {
            navigate("/admin");
          } else {
            navigate("/profile");
          }
        }, 1500);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setError("");
    setLoading(true);
    try {
      let result;

      switch (provider) {
        case "google":
          result = await signInWithGoogle();
          break;
        case "github":
          result = await signInWithGitHub();
          break;
        default:
          break;
      }
      setSuccess("Muvaffaqiyatli kirdingiz!");

      // Admin yoki oddiy user bo'lishiga qarab yo'naltirish
      setTimeout(() => {
        onClose();
        if (isAdmin()) {
          navigate("/admin");
        } else {
          navigate("/test-selection");
        }
      }, 1500);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setSuccess("");
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    });
  };

  return (
    <motion.div
      className="auth-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="auth-modal"
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="auth-close" onClick={onClose}>
          ×
        </button>

        <div className="auth-header">
          <motion.h2
            key={isLogin ? "login" : "signup"}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {isLogin ? "Tizimga kirish" : "Ro'yxatdan o'tish"}
          </motion.h2>
          {/* <p className="auth-subtitle">
            {isLogin ? "Akkauntingizga kiring" : "Yangi akkaunt yarating"}
          </p> */}
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {isLogin && (
            <>
              <div className="form-group">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Parol"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </>
          )}

          <AnimatePresence mode="wait">
            {!isLogin && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <FaUser className="input-icon" />
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Ism"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <FaIdCard className="input-icon" />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Familiya"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <FaEnvelope className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <FaLock className="input-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Parol"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  <div className="form-group">
                    <FaLock className="input-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Parolni tasdiqlang"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </>
            )}
          </AnimatePresence>

          {error && (
            <motion.div
              className="error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              className="success-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {success}
            </motion.div>
          )}

          <motion.button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <div className="loading-spinner"></div>
            ) : isLogin ? (
              "Kirish"
            ) : (
              "Ro'yxatdan o'tish"
            )}
          </motion.button>
        </form>

        <div className="social-login">
          <div className="social-divider">
            <span>yoki</span>
          </div>

          <div className="social-buttons">
            <motion.button
              className="social-btn google-btn"
              onClick={() => handleSocialLogin("google")}
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaGoogle />
              <span>Google</span>
            </motion.button>

            <motion.button
              className="social-btn github-btn"
              onClick={() => handleSocialLogin("github")}
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaGithub />
              <span>GitHub</span>
            </motion.button>
          </div>
        </div>

        <div className="auth-footer">
          <p>
            {isLogin ? "Akkauntingiz yo'qmi?" : "Akkauntingiz bormi?"}
            <button className="toggle-mode-btn" onClick={toggleMode}>
              {isLogin ? "Ro'yxatdan o'ting" : "Tizimga kiring"}
            </button>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Auth;
