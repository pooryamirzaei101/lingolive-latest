import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const ADMIN_EMAIL = "pooryamirzaei101@gmail.com";


export default function AdminRoute({ children }) {

  const { user, loading } = useAuth();
console.log("USER OBJECT:", user);
console.log("USER EMAIL:", user?.email);
console.log("ADMIN EMAIL:", ADMIN_EMAIL);

  // Checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">
          Checking administrator access...
        </p>
      </div>
    );
  }


  // User is not logged in
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  const currentEmail =
    user.email?.trim().toLowerCase();


  const adminEmail =
    ADMIN_EMAIL.trim().toLowerCase();


  // Logged in but not admin
  if (currentEmail !== adminEmail) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }


  // Admin access granted
  return children;
}