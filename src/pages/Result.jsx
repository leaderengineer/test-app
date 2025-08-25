import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTest } from "../contexts/TestContext";
import { useTheme } from "../contexts/ThemeContext";
import "../styles/Result.css";

const Result = () => {
  const navigate = useNavigate();
  const { testResults, resetTest } = useTest();
  const { theme, toggleTheme } = useTheme();

  const [showResults, setShowResults] = useState(false);
  const [animateScore, setAnimateScore] = useState(false);

  useEffect(() => {
    if (!testResults) {
      navigate("/");
      return;
    }

    // Animate results appearance
    const timer = setTimeout(() => {
      setShowResults(true);
    }, 500);

    const scoreTimer = setTimeout(() => {
      setAnimateScore(true);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearTimeout(scoreTimer);
    };
  }, [testResults, navigate]);

  const handleRetakeTest = () => {
    resetTest();
    navigate("/test-selection");
  };

  const handleGoHome = () => {
    resetTest();
    navigate("/");
  };

  if (!testResults) {
    return null;
  }

  // Robust percentage calculation (fallback if not present)
  const safeTotal = Math.max(1, Number(testResults.totalQuestions || 0));
  const computedPercentage = Math.round(
    (Number(testResults.correctAnswers || 0) / safeTotal) * 100
  );
  const percentage = Number.isFinite(testResults.percentage)
    ? testResults.percentage
    : computedPercentage;

  const getPerformanceMessage = () => {
    if (percentage >= 90) return "Ajoyib natija! 🎉";
    if (percentage >= 80) return "Yaxshi natija! 👏";
    if (percentage >= 70) return "Yaxshi! 👍";
    if (percentage >= 60) return "O'rtacha natija 📚";
    return "Yaxshilash kerak 💪";
  };

  const getPerformanceColor = () => {
    if (percentage >= 90) return "var(--gradient-accent)";
    if (percentage >= 80) return "var(--gradient-primary)";
    if (percentage >= 70) return "var(--gradient-secondary)";
    return "var(--gradient-secondary)";
  };

  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="result-container">
      {/* Background Animation */}
      <div className="result-background">
        <div className="result-shapes">
          <div className="result-shape result-shape-1"></div>
          <div className="result-shape result-shape-2"></div>
          <div className="result-shape result-shape-3"></div>
          <div className="result-shape result-shape-4"></div>
        </div>
      </div>

      {/* Header */}
      <header className="result-header animate-slide-in-top">
        <h1 className="result-title">Test Natijasi</h1>

        <button className="theme-toggle-result" onClick={toggleTheme}>
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </header>

      {/* Main Content */}
      <main className="result-main">
        <div className={`result-card ${showResults ? "show" : ""}`}>
          {/* Performance Message */}
          <div className="performance-message animate-fade-in-up">
            <div className="message-icon">🎯</div>
            <h2 className="message-text">{getPerformanceMessage()}</h2>
          </div>

          {/* Score Circle */}
          <div className="score-section animate-scale-in">
            <div
              className="score-circle"
              style={{ background: getPerformanceColor() }}
            >
              <div className="score-content">
                <span className="score-percentage">{percentage}%</span>
                <span className="score-label">Natija</span>
              </div>
              <div className="score-ring"></div>
            </div>
          </div>

          {/* Statistics */}
          <div className="statistics-section animate-fade-in-up">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <span className="stat-value">
                    {testResults.totalQuestions}
                  </span>
                  <span className="stat-label">Umumiy testlar soni</span>
                </div>
              </div>

              <div className="stat-card correct-stat">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <span className="stat-value">
                    {testResults.correctAnswers}
                  </span>
                  <span className="stat-label">To'g'ri javoblar soni</span>
                </div>
              </div>

              <div className="stat-card incorrect-stat">
                <div className="stat-icon">❌</div>
                <div className="stat-content">
                  <span className="stat-value">
                    {testResults.incorrectAnswers}
                  </span>
                  <span className="stat-label">Noto'g'ri javoblar soni</span>
                </div>
              </div>

              <div className="stat-card time-stat">
                <div className="stat-icon">⏱️</div>
                <div className="stat-content">
                  <span className="stat-value">
                    {formatTime(testResults.timeSpent)}
                  </span>
                  <span className="stat-label">Sarflangan vaqt</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="analysis-section animate-fade-in-up">
            <h3 className="analysis-title">Batafsil Tahlil</h3>
            <div className="analysis-content">
              <div className="analysis-item">
                <span className="analysis-label">To'g'rilik darajasi:</span>
                <div className="analysis-bar">
                  <div
                    className="analysis-fill"
                    style={{
                      width: `${percentage}%`,
                      background: getPerformanceColor(),
                    }}
                  ></div>
                </div>
                <span className="analysis-value">{percentage}%</span>
              </div>

              <div className="analysis-item">
                <span className="analysis-label">O'rtacha tezlik:</span>
                <span className="analysis-value">
                  {Math.round(
                    testResults.timeSpent / testResults.totalQuestions / 1000
                  )}
                  s/savol
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons-result animate-fade-in-up">
            <button className="retake-btn" onClick={handleRetakeTest}>
              <span className="btn-icon">🔄</span>
              <span className="btn-text">Testni Qaytadan Ishlash</span>
            </button>

            <button className="home-btn" onClick={handleGoHome}>
              <span className="btn-icon">🏠</span>
              <span className="btn-text">Bosh Sahifaga Qaytish</span>
            </button>
          </div>
        </div>
      </main>

      {/* Floating Elements */}
      <div className="floating-elements">
        <div className="floating-star">⭐</div>
        <div className="floating-star">🌟</div>
        <div className="floating-star">💫</div>
      </div>
    </div>
  );
};

export default Result;
