import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaCalendar,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import "../styles/UserProfile.css";

const UserProfile = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: userProfile?.firstName || "",
    lastName: userProfile?.lastName || "",
    age: userProfile?.age || "",
  });

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      firstName: userProfile?.firstName || "",
      lastName: userProfile?.lastName || "",
      age: userProfile?.age || "",
    });
  };

  const handleSave = () => {
    // Bu yerda Firestore'da foydalanuvchi ma'lumotlarini yangilash mumkin
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      firstName: userProfile?.firstName || "",
      lastName: userProfile?.lastName || "",
      age: userProfile?.age || "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };



  const handleBack = () => {
    navigate("/");
  };

  const handleTestSelection = () => {
    navigate("/test-selection");
  };

  if (!currentUser || !userProfile) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Profil yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Background Animation */}
      <div className="profile-background">
        <div className="profile-shapes">
          <div className="profile-shape profile-shape-1"></div>
          <div className="profile-shape profile-shape-2"></div>
          <div className="profile-shape profile-shape-3"></div>
        </div>
      </div>

      {/* Header */}
      <header className="profile-header">
        <button className="back-btn-profile" onClick={handleBack}>
          <span className="back-icon">←</span>
          <span className="back-text">Orqaga</span>
        </button>

        <h1 className="profile-title">Foydalanuvchi Profili</h1>

        <button className="theme-toggle-profile" onClick={toggleTheme}>
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </header>

      {/* Main Content */}
      <main className="profile-main">
        <motion.div
          className="profile-card"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Header */}
          <div className="profile-header-section">
            <div className="profile-avatar">
              {userProfile.firstName
                ? userProfile.firstName[0].toUpperCase()
                : "U"}
            </div>
            <div className="profile-info">
              <h2 className="profile-name">
                {userProfile.firstName && userProfile.lastName
                  ? `${userProfile.firstName} ${userProfile.lastName}`
                  : userProfile.username || "Foydalanuvchi"}
              </h2>
              <p className="profile-email">{currentUser.email}</p>
              {userProfile.provider && (
                <span className="provider-badge">
                  {userProfile.provider === "google" && "Google"}
                  {userProfile.provider === "github" && "GitHub"}
                  {userProfile.provider === "facebook" && "Facebook"}
                </span>
              )}
            </div>
          </div>

          {/* Profile Details */}
          <div className="profile-details">
            <div className="detail-item">
              <FaUser className="detail-icon" />
              <div className="detail-content">
                <label>Username</label>
                <span>{userProfile.username || "Kiritilmagan"}</span>
              </div>
            </div>

            <div className="detail-item">
              <FaUser className="detail-icon" />
              <div className="detail-content">
                <label>Ism</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="firstName"
                    value={editData.firstName}
                    onChange={handleInputChange}
                    placeholder="Ism"
                  />
                ) : (
                  <span>{userProfile.firstName || "Kiritilmagan"}</span>
                )}
              </div>
            </div>

            <div className="detail-item">
              <FaUser className="detail-icon" />
              <div className="detail-content">
                <label>Familiya</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="lastName"
                    value={editData.lastName}
                    onChange={handleInputChange}
                    placeholder="Familiya"
                  />
                ) : (
                  <span>{userProfile.lastName || "Kiritilmagan"}</span>
                )}
              </div>
            </div>

            <div className="detail-item">
              <FaCalendar className="detail-icon" />
              <div className="detail-content">
                <label>Yosh</label>
                {isEditing ? (
                  <input
                    type="number"
                    name="age"
                    value={editData.age}
                    onChange={handleInputChange}
                    placeholder="Yosh"
                    min="1"
                    max="120"
                  />
                ) : (
                  <span>
                    {userProfile.age
                      ? `${userProfile.age} yosh`
                      : "Kiritilmagan"}
                  </span>
                )}
              </div>
            </div>

            <div className="detail-item">
              <FaEnvelope className="detail-icon" />
              <div className="detail-content">
                <label>Email</label>
                <span>{currentUser.email}</span>
              </div>
            </div>

            <div className="detail-item">
              <FaCalendar className="detail-icon" />
              <div className="detail-content">
                <label>Ro'yxatdan o'tgan sana</label>
                <span>
                  {userProfile.createdAt
                    ? new Date(userProfile.createdAt).toLocaleDateString(
                        "uz-UZ"
                      )
                    : "Ma'lum emas"}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="profile-actions">
            {isEditing ? (
              <div className="edit-actions">
                <motion.button
                  className="action-btn save-btn"
                  onClick={handleSave}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaSave />
                  Saqlash
                </motion.button>
                <motion.button
                  className="action-btn cancel-btn"
                  onClick={handleCancel}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaTimes />
                  Bekor qilish
                </motion.button>
              </div>
            ) : (
              <motion.button
                className="action-btn edit-btn"
                onClick={handleEdit}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaEdit />
                Tahrirlash
              </motion.button>
            )}
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <motion.button
              className="quick-action-btn test-btn"
              onClick={handleTestSelection}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              📝 Test Yechish
            </motion.button>


          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default UserProfile;
