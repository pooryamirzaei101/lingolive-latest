import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

// Main Pages
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import IELTS from "./pages/IELTS";
import Grammar from "./pages/Grammar";
import Stories from "./pages/Stories";
import Podcasts from "./pages/Podcasts";
import Vocabulary from "./pages/Vocabulary";
import Flashcards from "./pages/Flashcards";
import Conversation from "./pages/Conversation";
import Newsletter from "./pages/Newsletter";
import LessonLibrary from "./pages/LessonLibrary";
import Lesson from "./pages/Lesson";
import Videos from "./pages/Videos";

// Dashboard
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";

// Shop
import Shop from "./shop/pages/Shop";
import Cart from "./cart/pages/Cart";
import Checkout from "./checkout/pages/Checkout";
import OrderConfirmation from "./checkout/pages/OrderConfirmation";

// Authentication
import Login from "./auth/pages/Login";
import Register from "./auth/pages/Register";
import ForgotPassword from "./auth/pages/ForgotPassword";
import ResetPassword from "./auth/pages/ResetPassword";
import Profile from "./auth/pages/Profile";
import Settings from "./auth/pages/Settings";
import Onboarding from "./auth/pages/Onboarding";

// Context
import { CartProvider } from "./context/CartContext";

// Route Protection
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>

          {/* ================= Website ================= */}

          <Route element={<MainLayout />}>

            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/ielts" element={<IELTS />} />
            <Route path="/grammar" element={<Grammar />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/podcasts" element={<Podcasts />} />
            <Route path="/vocabulary" element={<Vocabulary />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/conversation" element={<Conversation />} />
            <Route path="/newsletter" element={<Newsletter />} />
            <Route path="/grammar/:level" element={<LessonLibrary category="Grammar" />} />
            <Route path="/stories/:level" element={<LessonLibrary category="Stories" />} />
            <Route path="/conversation/:level" element={<LessonLibrary category="Conversation" />} />
            <Route path="/ielts/:level" element={<LessonLibrary category="IELTS" />} />
            <Route path="/lessons/:lessonId" element={<Lesson />} />
            <Route path="/videos" element={<Videos />} />

            {/* Shop */}

            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route
              path="/order-confirmation"
              element={<OrderConfirmation />}
            />

            {/* Student Dashboard */}

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin Dashboard */}

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />

          </Route>

          {/* ================= Authentication ================= */}

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />
          <Route
            path="/reset-password"
            element={<ResetPassword />}
          />
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
