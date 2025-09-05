import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { TestProvider } from "./contexts/TestContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Home from "./pages/Home";
import AdminPanel from "./pages/AdminPanel";
import TestSelection from "./pages/TestSelection";
import TestPage from "./pages/TestPage";
import Result from "./pages/Result";
import UserProfile from "./pages/UserProfile";
import "./styles/globals.css";

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { currentUser, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Yuklanmoqda...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Main App Routes
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminPanel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/test-selection"
        element={
          <ProtectedRoute>
            <TestSelection />
          </ProtectedRoute>
        }
      />
      <Route
        path="/test/:difficulty"
        element={
          <ProtectedRoute>
            <TestPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/result"
        element={
          <ProtectedRoute>
            <Result />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TestProvider>
          <Router>
            <div className="App">
              <AppRoutes />
            </div>
          </Router>
        </TestProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
