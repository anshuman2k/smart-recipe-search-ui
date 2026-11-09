import { useEffect, useState, useRef } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  ChefHat,
  Sun,
  Moon,
  User,
  Heart,
  SlidersHorizontal,
  LogOut,
  ChevronDown,
} from "lucide-react";
import "./App.css";
import "./styles/auth.css";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

/* ── Pages ── */
import HomePage from "./pages/HomePage";
import FindRecipesPage from "./pages/FindRecipesPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import FavoritesPage from "./pages/FavoritesPage";
import ProfilePage from "./pages/ProfilePage";
import PreferencesPage from "./pages/PreferencesPage";
import ProtectedRoute from "./components/ProtectedRoute";

/* ═══════════════════════════════════════════════
   Shell — navbar + footer + theme toggle
   ═══════════════════════════════════════════════ */

function AppShell() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
    return "dark"; // Default to dark forest green as signature identity
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  return (
    <div className="app">
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/find-recipes" element={<FindRecipesPage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected Routes */}
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/preferences"
            element={
              <ProtectedRoute>
                <PreferencesPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Navbar
   ═══════════════════════════════════════════════ */

function Navbar({
  theme,
  toggleTheme,
}: {
  theme: "light" | "dark";
  toggleTheme: () => void;
}) {
  const { user, loading } = useAuth();
  const location = useLocation();

  return (
    <header className="navbar">
      <Link className="brand" to="/">
        <span className="brand-icon">
          <ChefHat size={22} />
        </span>
        <span>
          recipe<span className="brand-highlight">mind</span>
        </span>
      </Link>

      <nav>
        <Link
          className={location.pathname === "/" ? "nav-active" : ""}
          to="/"
        >
          Discover
        </Link>
        <Link
          className={location.pathname === "/find-recipes" ? "nav-active" : ""}
          to="/find-recipes"
        >
          Find Recipes
        </Link>
        <a href="/#about">About</a>
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {!loading && user && <ProfileMenu />}
      </div>
    </header>
  );
}

/* ── Logged-in profile dropdown ── */

function ProfileMenu() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const email = user?.email ?? "User";
  const initial = email.charAt(0).toUpperCase();

  async function handleLogout() {
    await signOut();
    setOpen(false);
    navigate("/");
  }

  return (
    <div className="profile-area" ref={ref}>
      <button
        className="profile-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="profile-avatar">{initial}</span>
        <span>{email}</span>
        <ChevronDown size={14} />
      </button>

      {open && (
        <div className="profile-dropdown">
          <div className="profile-email">{email}</div>
          <div className="profile-dropdown-divider" />

          <button
            className="profile-dropdown-item"
            onClick={() => {
              navigate("/profile");
              setOpen(false);
            }}
          >
            <User size={16} /> Profile
          </button>

          <button
            className="profile-dropdown-item"
            onClick={() => {
              navigate("/favorites");
              setOpen(false);
            }}
          >
            <Heart size={16} /> Favorites
          </button>

          <button
            className="profile-dropdown-item"
            onClick={() => {
              navigate("/preferences");
              setOpen(false);
            }}
          >
            <SlidersHorizontal size={16} /> Preferences
          </button>

          <div className="profile-dropdown-divider" />

          <button
            className="profile-dropdown-item logout-item"
            onClick={handleLogout}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Footer
   ═══════════════════════════════════════════════ */

function Footer() {
  return (
    <footer id="about">
      <div className="footer-top">
        <div className="footer-brand-col">
          <Link className="footer-brand" to="/">
            <ChefHat size={22} /> recipemind
          </Link>
          <p className="footer-desc">
            Discover recipes that match your ingredients, cravings and lifestyle.
            Intelligent semantic matching for every home cook.
          </p>
        </div>

        <div className="footer-nav-groups">
          <div className="footer-col">
            <strong>Platform</strong>
            <Link to="/">Discover</Link>
            <Link to="/find-recipes">Find Recipes</Link>
            <a href="/#recipes">Featured Dishes</a>
          </div>

          <div className="footer-col">
            <strong>Account</strong>
            <Link to="/sign-in">Sign In</Link>
            <Link to="/sign-up">Get Started</Link>
            <Link to="/favorites">My Favorites</Link>
            <Link to="/preferences">Dietary Preferences</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 RecipeMind, Inc. All rights reserved.</span>
        <span>Built with care for culinary creators.</span>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════
   Root export — wraps everything with providers
   ═══════════════════════════════════════════════ */

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  );
}
