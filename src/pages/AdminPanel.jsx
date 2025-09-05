import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTest } from "../contexts/TestContext";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import {
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiEye,
  FiChevronRight,
  FiChevronLeft,
  FiSearch,
  FiBookOpen,
  FiStar,
  FiZap,
  FiTarget,
  FiCheckCircle,
  FiXCircle,
  FiSettings,
  FiUsers,
  FiBarChart,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/AdminPanel.css";

const AdminPanel = () => {
  const navigate = useNavigate();
  const { addTest, editTest, deleteTest, tests, isLoadingTests } = useTest();
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  const [formData, setFormData] = useState({
    question: "",
    options: [
      { id: Math.random().toString(36).slice(2), text: "", isCorrect: false },
      { id: Math.random().toString(36).slice(2), text: "", isCorrect: false },
    ],
    difficulty: "easy",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [editingTest, setEditingTest] = useState(null);
  const [showTests, setShowTests] = useState(false);

  const [activeTab, setActiveTab] = useState("create");

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleGoToProfile = () => {
    navigate("/profile");
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Chiqishda xatolik:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOptionTextChange = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.map((o) =>
        o.id === id ? { ...o, text: value } : o
      ),
    }));
  };

  const addOptionRow = () => {
    setFormData((prev) => ({
      ...prev,
      options: [
        ...prev.options,
        { id: Math.random().toString(36).slice(2), text: "", isCorrect: false },
      ],
    }));
  };

  const removeOptionRow = (id) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((o) => o.id !== id),
    }));
  };

  const setCorrectOption = (id) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.map((o) => ({ ...o, isCorrect: o.id === id })),
    }));
  };

  const deriveOptionsFromLegacy = (test) => {
    const legacy = [test.optionA, test.optionB, test.optionC].filter(Boolean);
    return legacy.map((t) => ({
      id: Math.random().toString(36).slice(2),
      text: t,
      isCorrect: t === test.correctAnswer,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedOptions = (formData.options || []).map((o) => ({
      ...o,
      text: (o.text || "").trim(),
    }));
    const nonEmpty = cleanedOptions.filter((o) => o.text.length > 0);
    const hasAtLeastTwo = nonEmpty.length >= 2;
    const correct = nonEmpty.find((o) => o.isCorrect);
    if (!formData.question.trim() || !hasAtLeastTwo || !correct) {
      setMessage(
        !formData.question.trim()
          ? "Savol matnini kiriting!"
          : !hasAtLeastTwo
          ? "Kamida 2 ta javob variantini kiriting!"
          : "Bitta to'g'ri javobni belgilang!"
      );
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const normalizedOptions = nonEmpty.map((o) => ({
        id: o.id || Math.random().toString(36).slice(2),
        text: o.text,
        isCorrect: !!o.isCorrect,
      }));

      const newTest = {
        question: formData.question.trim(),
        options: normalizedOptions,
        correctAnswer: correct.text,
        difficulty: formData.difficulty,
      };

      await addTest(newTest);

      setMessage("Test muvaffaqiyatli qo'shildi!");

      // Reset form
      setFormData({
        question: "",
        options: [
          {
            id: Math.random().toString(36).slice(2),
            text: "",
            isCorrect: false,
          },
          {
            id: Math.random().toString(36).slice(2),
            text: "",
            isCorrect: false,
          },
        ],
        difficulty: "easy",
      });

      // Clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleEditTest = (test) => {
    setEditingTest(test);
    const options =
      Array.isArray(test.options) && test.options.length
        ? test.options.map((o) => ({
            id: o.id || Math.random().toString(36).slice(2),
            text: o.text,
            isCorrect: !!o.isCorrect,
          }))
        : deriveOptionsFromLegacy(test);
    setFormData({
      question: test.question,
      options,
      difficulty: test.difficulty,
    });
    setShowTests(false);
    setActiveTab("create");
  };

  const handleDeleteTest = async (testId) => {
    if (window.confirm("Bu testni o'chirishni xohlaysizmi?")) {
      await deleteTest(testId);
      setMessage("Test muvaffaqiyatli o'chirildi!");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleUpdateTest = async (e) => {
    e.preventDefault();

    const cleanedOptions = (formData.options || []).map((o) => ({
      ...o,
      text: (o.text || "").trim(),
    }));
    const nonEmpty = cleanedOptions.filter((o) => o.text.length > 0);
    const hasAtLeastTwo = nonEmpty.length >= 2;
    const correct = nonEmpty.find((o) => o.isCorrect);
    if (!formData.question.trim() || !hasAtLeastTwo || !correct) {
      setMessage(
        !formData.question.trim()
          ? "Savol matnini kiriting!"
          : !hasAtLeastTwo
          ? "Kamida 2 ta javob variantini kiriting!"
          : "Bitta to'g'ri javobni belgilang!"
      );
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const normalizedOptions = nonEmpty.map((o) => ({
        id: o.id || Math.random().toString(36).slice(2),
        text: o.text,
        isCorrect: !!o.isCorrect,
      }));

      const updatedTest = {
        ...editingTest,
        question: formData.question.trim(),
        options: normalizedOptions,
        correctAnswer: correct.text,
        difficulty: formData.difficulty,
      };

      await editTest(editingTest.id, updatedTest);
      setMessage("Test muvaffaqiyatli yangilandi!");

      // Reset form and editing state
      setFormData({
        question: "",
        options: [
          {
            id: Math.random().toString(36).slice(2),
            text: "",
            isCorrect: false,
          },
          {
            id: Math.random().toString(36).slice(2),
            text: "",
            isCorrect: false,
          },
        ],
        difficulty: "easy",
      });
      setEditingTest(null);

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingTest(null);
    setFormData({
      question: "",
      options: [
        { id: Math.random().toString(36).slice(2), text: "", isCorrect: false },
        { id: Math.random().toString(36).slice(2), text: "", isCorrect: false },
      ],
      difficulty: "easy",
    });
  };

  const toggleShowTests = () => {
    setShowTests(!showTests);
    if (editingTest) {
      handleCancelEdit();
    }
  };

  const formatDate = (ts) => {
    if (!ts) return "";
    try {
      if (typeof ts?.toDate === "function") {
        return ts.toDate().toLocaleDateString("uz-UZ");
      }
      const d = new Date(ts);
      return isNaN(d.getTime()) ? "" : d.toLocaleDateString("uz-UZ");
    } catch (e) {
      return "";
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return <FiStar className="difficulty-icon easy" />;
      case "medium":
        return <FiTarget className="difficulty-icon medium" />;
      case "hard":
        return <FiZap className="difficulty-icon hard" />;
      default:
        return <FiStar className="difficulty-icon" />;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "#10b981";
      case "medium":
        return "#f59e0b";
      case "hard":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  return (
    <div className="admin-container" data-theme={theme}>
      {/* Floating Background Elements */}
      <div className="floating-elements">
        <motion.div
          className="floating-element element-1"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <FiBookOpen />
        </motion.div>
        <motion.div
          className="floating-element element-2"
          animate={{
            y: [0, 15, 0],
            rotate: [0, -3, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <FiTarget />
        </motion.div>
        <motion.div
          className="floating-element element-3"
          animate={{
            y: [0, -25, 0],
            rotate: [0, 8, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <FiZap />
        </motion.div>
      </div>

      {/* Header */}
      <motion.header
        className="admin-header"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.button
          className="back-btn"
          onClick={handleBackToHome}
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiChevronLeft className="back-icon" />
          <span className="back-text">Orqaga</span>
        </motion.button>

        <div className="header-center">
          <h1 className="admin-title">
            <FiSettings className="title-icon" />
            Admin Panel
          </h1>
          <p className="header-subtitle">Test tizimini boshqarish</p>
        </div>

        <div className="header-actions">
          <motion.button
            className="logout-btn"
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="logout-icon">🚪</span>
            <span className="logout-text">Chiqish</span>
          </motion.button>

          <motion.button
            className="theme-toggle-admin"
            onClick={toggleTheme}
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </motion.button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="admin-main">
        {/* Tab Navigation */}
        <motion.div
          className="tab-navigation"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.button
            className={`tab-btn ${activeTab === "create" ? "active" : ""}`}
            onClick={() => setActiveTab("create")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiPlus className="tab-icon" />
            Test Yaratish
          </motion.button>
          <motion.button
            className={`tab-btn ${activeTab === "manage" ? "active" : ""}`}
            onClick={() => setActiveTab("manage")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiUsers className="tab-icon" />
            Testlarni Boshqarish
          </motion.button>
          <motion.button
            className={`tab-btn ${activeTab === "stats" ? "active" : ""}`}
            onClick={() => setActiveTab("stats")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiBarChart className="tab-icon" />
            Statistika
          </motion.button>
        </motion.div>

        {/* Create Test Tab */}
        <AnimatePresence mode="wait">
          {activeTab === "create" && (
            <motion.div
              key="create"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="admin-card create-test-card"
            >
              <div className="card-header">
                <motion.div
                  className="header-icon"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <FiBookOpen />
                </motion.div>
                <h2>Yangi Test Yaratish</h2>
                <p>O'quvchilar uchun yangi test savolini tuzing</p>
              </div>

              <form
                onSubmit={editingTest ? handleUpdateTest : handleSubmit}
                className="admin-form"
              >
                {/* Question Input */}
                <motion.div
                  className="form-group question-group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <label htmlFor="question">
                    <FiBookOpen className="label-icon" />
                    Test Savoli
                  </label>
                  <div className="input-wrapper">
                    <textarea
                      id="question"
                      name="question"
                      value={formData.question}
                      onChange={handleInputChange}
                      placeholder="Test savolini kiriting..."
                      rows="4"
                      required
                      className="question-textarea"
                    />
                    <div className="input-focus-border"></div>
                  </div>
                </motion.div>

                {/* Options Builder */}
                <motion.div
                  className="options-builder"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="options-header">
                    <h3>
                      <FiTarget className="section-icon" />
                      Javob Variantlari
                    </h3>
                    <p>
                      Kamida 2 ta variant kiriting va to'g'ri javobni belgilang
                    </p>
                  </div>

                  <div className="options-list">
                    {formData.options.map((opt, idx) => (
                      <motion.div
                        className="option-row"
                        key={opt.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * idx }}
                        layout
                      >
                        <motion.button
                          type="button"
                          className={`correct-toggle ${
                            opt.isCorrect ? "active" : ""
                          }`}
                          onClick={() => setCorrectOption(opt.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          aria-label="To'g'ri javobni belgilash"
                        >
                          {opt.isCorrect ? <FiCheckCircle /> : <FiStar />}
                        </motion.button>

                        <div className="option-input-wrapper">
                          <input
                            type="text"
                            className="option-input"
                            placeholder={`Variant ${idx + 1}`}
                            value={opt.text}
                            onChange={(e) =>
                              handleOptionTextChange(opt.id, e.target.value)
                            }
                          />
                          <div className="input-focus-border"></div>
                        </div>

                        {formData.options.length > 2 && (
                          <motion.button
                            type="button"
                            className="remove-option"
                            onClick={() => removeOptionRow(opt.id)}
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label="Variantni o'chirish"
                          >
                            <FiXCircle />
                          </motion.button>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  <motion.button
                    type="button"
                    className="add-option"
                    onClick={addOptionRow}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiPlus className="add-icon" />
                    Yangi Variant Qo'shish
                  </motion.button>

                  <div className="options-hint">
                    <FiStar className="hint-icon" />
                    <span>Bitta yulduzni bosib to'g'ri javobni belgilang</span>
                  </div>
                </motion.div>

                {/* Difficulty Selection */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <div className="form-group difficulty-group">
                    <label htmlFor="difficulty">
                      <FiZap className="label-icon" />
                      Test Darajasi
                    </label>
                    <div className="difficulty-options">
                      {["easy", "medium", "hard"].map((diff) => (
                        <motion.button
                          key={diff}
                          type="button"
                          className={`difficulty-option ${
                            formData.difficulty === diff ? "active" : ""
                          }`}
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              difficulty: diff,
                            }))
                          }
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {getDifficultyIcon(diff)}
                          <span>
                            {diff === "easy" && "Oson"}
                            {diff === "medium" && "O'rtacha"}
                            {diff === "hard" && "Qiyin"}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Message Display */}
                <AnimatePresence>
                  {message && (
                    <motion.div
                      className={`message ${
                        message.includes("muvaffaqiyatli") ? "success" : "error"
                      }`}
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      {message.includes("muvaffaqiyatli") ? (
                        <FiCheckCircle className="message-icon" />
                      ) : (
                        <FiXCircle className="message-icon" />
                      )}
                      {message}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form Actions */}
                <motion.div
                  className="form-actions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  {editingTest && (
                    <motion.button
                      type="button"
                      className="cancel-btn"
                      onClick={handleCancelEdit}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiXCircle className="btn-icon" />
                      Bekor Qilish
                    </motion.button>
                  )}

                  <motion.button
                    type="submit"
                    className="submit-btn"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="btn-content">
                      {isSubmitting ? (
                        <>
                          <motion.div
                            className="loading-spinner"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />
                          Yuborilmoqda...
                        </>
                      ) : (
                        <>
                          {editingTest ? (
                            <>
                              <FiEdit2 className="btn-icon" />
                              Yangilash
                            </>
                          ) : (
                            <>
                              <FiPlus className="btn-icon" />
                              Test Yaratish
                            </>
                          )}
                        </>
                      )}
                    </span>
                    <div className="btn-ripple"></div>
                  </motion.button>
                </motion.div>
              </form>
            </motion.div>
          )}

          {/* Manage Tests Tab */}
          {activeTab === "manage" && (
            <motion.div
              key="manage"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="admin-card manage-tests-card"
            >
              <div className="card-header">
                <motion.div
                  className="header-icon"
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <FiUsers />
                </motion.div>
                <h2>Testlarni Boshqarish</h2>
                <p>Mavjud testlarni ko'rish, tahrirlash va o'chirish</p>
              </div>

              <div className="tests-section">
                <div className="tests-header">
                  <h3>Mavjud Testlar</h3>
                  <motion.button
                    className="toggle-tests-btn"
                    onClick={toggleShowTests}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiEye className="btn-icon" />
                    {showTests ? "Yashirish" : "Ko'rsatish"}
                  </motion.button>
                </div>

                <AnimatePresence>
                  {showTests && (
                    <motion.div
                      className="tests-list"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {isLoadingTests ? (
                        <div className="loading-state">
                          <motion.div
                            className="loading-spinner large"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />
                          <p>Yuklanmoqda...</p>
                        </div>
                      ) : (
                        Object.entries(tests).map(
                          ([difficulty, difficultyTests]) => (
                            <motion.div
                              key={difficulty}
                              className="difficulty-section"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5 }}
                            >
                              <h4 className="difficulty-title">
                                {getDifficultyIcon(difficulty)}
                                <span>
                                  {difficulty === "easy" && "😊 Oson"}
                                  {difficulty === "medium" && "🤔 O'rtacha"}
                                  {difficulty === "hard" && "😤 Qiyin"}
                                </span>
                                <span className="test-count">
                                  ({difficultyTests.length} ta)
                                </span>
                              </h4>

                              {difficultyTests.length === 0 ? (
                                <div className="no-tests">
                                  <FiBookOpen className="no-tests-icon" />
                                  <p>Bu darajada testlar mavjud emas</p>
                                </div>
                              ) : (
                                <div className="tests-grid">
                                  {difficultyTests.map((test, index) => (
                                    <motion.div
                                      key={test.id}
                                      className="test-card"
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{
                                        duration: 0.4,
                                        delay: index * 0.1,
                                      }}
                                      whileHover={{ y: -8, scale: 1.02 }}
                                      layout
                                    >
                                      <div className="test-content">
                                        <div className="test-header">
                                          <h5 className="test-question">
                                            {test.question}
                                          </h5>
                                          <div
                                            className="difficulty-badge"
                                            style={{
                                              backgroundColor:
                                                getDifficultyColor(
                                                  test.difficulty
                                                ),
                                            }}
                                          >
                                            {getDifficultyIcon(test.difficulty)}
                                          </div>
                                        </div>

                                        <div className="test-options">
                                          {Array.isArray(test.options) &&
                                          test.options.length
                                            ? test.options.map((o, i) => (
                                                <div
                                                  className="option"
                                                  key={o.id || i}
                                                >
                                                  <span className="option-label">
                                                    {String.fromCharCode(
                                                      65 + i
                                                    )}
                                                    :
                                                  </span>
                                                  <span className="option-text">
                                                    {o.text}
                                                  </span>
                                                  {o.isCorrect && (
                                                    <FiCheckCircle className="correct-indicator" />
                                                  )}
                                                </div>
                                              ))
                                            : [
                                                test.optionA,
                                                test.optionB,
                                                test.optionC,
                                              ]
                                                .filter(Boolean)
                                                .map((t, i) => (
                                                  <div
                                                    className="option"
                                                    key={i}
                                                  >
                                                    <span className="option-label">
                                                      {String.fromCharCode(
                                                        65 + i
                                                      )}
                                                      :
                                                    </span>
                                                    <span className="option-text">
                                                      {t}
                                                    </span>
                                                  </div>
                                                ))}
                                        </div>

                                        <div className="test-info">
                                          <span className="correct-answer">
                                            <FiCheckCircle className="info-icon" />
                                            To'g'ri: {test.correctAnswer}
                                          </span>
                                          <span className="test-date">
                                            {formatDate(test.createdAt)}
                                          </span>
                                        </div>

                                        <div className="test-actions">
                                          <motion.button
                                            className="edit-btn"
                                            onClick={() => handleEditTest(test)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                          >
                                            <FiEdit2 className="btn-icon" />
                                            Tahrirlash
                                          </motion.button>

                                          <motion.button
                                            className="delete-btn"
                                            onClick={() =>
                                              handleDeleteTest(test.id)
                                            }
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                          >
                                            <FiTrash2 className="btn-icon" />
                                            O'chirish
                                          </motion.button>
                                        </div>
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              )}
                            </motion.div>
                          )
                        )
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Statistics Tab */}
          {activeTab === "stats" && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="admin-card stats-card"
            >
              <div className="card-header">
                <motion.div
                  className="header-icon"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <FiBarChart />
                </motion.div>
                <h2>Test Tizimi Statistikalari</h2>
                <p>Test tizimi haqida umumiy ma'lumotlar</p>
              </div>

              <div className="stats-grid">
                <motion.div
                  className="stat-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="stat-icon">
                    <FiBookOpen />
                  </div>
                  <div className="stat-content">
                    <h3>Jami Testlar</h3>
                    <p className="stat-number">
                      {Object.values(tests).flat().length}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="stat-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="stat-icon">
                    <FiStar />
                  </div>
                  <div className="stat-content">
                    <h3>Oson Testlar</h3>
                    <p className="stat-number">{tests.easy?.length || 0}</p>
                  </div>
                </motion.div>

                <motion.div
                  className="stat-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="stat-icon">
                    <FiTarget />
                  </div>
                  <div className="stat-content">
                    <h3>O'rtacha Testlar</h3>
                    <p className="stat-number">{tests.medium?.length || 0}</p>
                  </div>
                </motion.div>

                <motion.div
                  className="stat-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="stat-icon">
                    <FiZap />
                  </div>
                  <div className="stat-content">
                    <h3>Qiyin Testlar</h3>
                    <p className="stat-number">{tests.hard?.length || 0}</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminPanel;
