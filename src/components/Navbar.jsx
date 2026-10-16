import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { cartCount } = useCart();

  return (
    <nav className="bg-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600"
        >
          English Learning
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-5 font-medium text-gray-700">

          <Link
            to="/"
            className="transition hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            to="/courses"
            className="transition hover:text-blue-600"
          >
            Courses
          </Link>

          <Link
            to="/ielts"
            className="transition hover:text-blue-600"
          >
            IELTS
          </Link>

          <Link
            to="/grammar"
            className="transition hover:text-blue-600"
          >
            Grammar
          </Link>

          <Link
            to="/stories"
            className="transition hover:text-blue-600"
          >
            Stories
          </Link>

          <Link
            to="/podcasts"
            className="transition hover:text-blue-600"
          >
            Podcasts
          </Link>

          <Link
            to="/vocabulary"
            className="transition hover:text-blue-600"
          >
            Vocabulary
          </Link>

          <Link
            to="/flashcards"
            className="transition hover:text-blue-600"
          >
            Flashcards
          </Link>

          <Link
            to="/conversation"
            className="transition hover:text-blue-600"
          >
            Conversation
          </Link>

          <Link
            to="/videos"
            className="transition hover:text-blue-600"
          >
            Videos
          </Link>

          <Link
            to="/shop"
            className="transition hover:text-blue-600"
          >
            Shop
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="flex items-center gap-1 transition hover:text-blue-600"
          >
            <span className="text-lg">
              🛒
            </span>

            <span>
              Cart
            </span>

            <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">
              {cartCount}
            </span>
          </Link>

          {/* Login */}
          <Link
            to="/login"
            className="transition hover:text-blue-600"
          >
            Login
          </Link>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;
