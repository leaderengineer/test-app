import { useNavigate } from "react-router-dom";
import { useTest } from "../contexts/TestContext";
import { useTheme } from "../contexts/ThemeContext";
import "../styles/TestSelection.css";

const TestSelection = () => {
  const navigate = useNavigate();
  const { tests, isLoadingTests } = useTest();
  const { theme, toggleTheme } = useTheme();

  const difficulties = [
    { key: "easy", name: "Oson", icon: "😊", color: "var(--gradient-accent)" },
    {
      key: "medium",
      name: "O'rtacha",
      icon: "🤔",
      color: "var(--gradient-primary)",
    },
    {
      key: "hard",
      name: "Qiyin",
      icon: "😤",
      color: "var(--gradient-secondary)",
    },
  ];

  const handleDifficultySelect = (difficulty) => {
    if (isLoadingTests) {
      alert("Testlar yuklanmoqda, biroz kuting...");
      return;
    }
    if (tests[difficulty] && tests[difficulty].length > 0) {
      navigate(`/test/${difficulty}`);
    } else {
      alert("Bu darajada hali test savollari mavjud emas!");
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  const getTestCount = (difficulty) => {
    return tests[difficulty] ? tests[difficulty].length : 0;
  };

  return (
    <div className="test-selection-container">
      {/* Background Animation */}
      <div className="selection-background">
        <div className="selection-shapes">
          <div className="selection-shape selection-shape-1"></div>
          <div className="selection-shape selection-shape-2"></div>
          <div className="selection-shape selection-shape-3"></div>
          <div className="selection-shape selection-shape-4"></div>
        </div>
      </div>

      {/* Header */}
      <header className="selection-header animate-slide-in-top">
        <button className="back-btn-selection" onClick={handleBack}>
          <span className="back-icon">←</span>
          <span className="back-text">Orqaga</span>
        </button>

        <h1 className="selection-title">Test Darajasini Tanlang</h1>

        <button className="theme-toggle-selection" onClick={toggleTheme}>
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </header>

      {/* Main Content */}
      <main className="selection-main animate-fade-in-up">
        <div className="selection-content">
          <div className="selection-description">
            <h2>Qaysi darajada test yechmoqchisiz?</h2>
            <p>O'z bilimingiz darajasiga mos test darajasini tanlang</p>
          </div>

          <div className="difficulty-cards">
            {difficulties.map((difficulty, index) => (
              <div
                key={difficulty.key}
                className={`difficulty-card animate-bounce-in`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="card-header-selection">
                  <div
                    className="difficulty-icon"
                    style={{ background: difficulty.color }}
                  >
                    {difficulty.icon}
                  </div>
                  <h3 className="difficulty-name">{difficulty.name}</h3>
                </div>

                <div className="card-content">
                  <div className="test-count">
                    <span className="count-number">
                      {getTestCount(difficulty.key)}
                    </span>
                    <span className="count-label">ta test</span>
                  </div>

                  <div className="difficulty-description">
                    {difficulty.key === "easy" &&
                      "Boshlang'ich darajadagi savollar"}
                    {difficulty.key === "medium" &&
                      "O'rtacha darajadagi savollar"}
                    {difficulty.key === "hard" && "Yuqori darajadagi savollar"}
                  </div>
                </div>

                <div className="card-footer">
                  <button
                    className="start-test-btn"
                    style={{ background: difficulty.color }}
                    onClick={() => handleDifficultySelect(difficulty.key)}
                  >
                    Testni Boshlash
                    <span className="btn-arrow">→</span>
                  </button>
                </div>

                <div className="card-glow"></div>
              </div>
            ))}
          </div>

          {!isLoadingTests &&
            Object.values(tests).every(
              (difficulty) => difficulty.length === 0
            ) && (
              <div className="no-tests-message animate-fade-in-up">
                <div className="no-tests-icon">📝</div>
                <h3>Hali test savollari mavjud emas</h3>
                <p>Admin panel orqali test savollarini qo'shing</p>
                <button
                  className="go-admin-btn"
                  onClick={() => navigate("/admin")}
                >
                  Admin Panelga O'tish
                </button>
              </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default TestSelection;
