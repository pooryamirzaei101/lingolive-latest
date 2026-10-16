import { useMemo, useState } from "react";

import ProductCard from "../components/ProductCard";
import ProductFilters from "../components/ProductFilters";
import ProductDetails from "../components/ProductDetails";

import PDFProductCard from "../components/PDFProductCard";
import PDFProductDetails from "../components/PDFProductDetails";

import EBookProductCard from "../components/EBookProductCard";
import EBookProductDetails from "../components/EBookProductDetails";

import CourseProductCard from "../components/CourseProductCard";
import CourseProductDetails from "../components/CourseProductDetails";

const sampleProducts = [
  // =========================
  // COURSES
  // =========================

  {
    id: 1,
    title: "Complete English Grammar Course",
    category: "Grammar",
    type: "Course",
    price: 49,
    level: "Beginner to Advanced",
    lessons: 120,
    duration: "25 hours",
    description:
      "A complete English grammar course covering beginner to advanced grammar concepts with lessons and practical exercises.",
    image: "",
  },

  {
    id: 2,
    title: "IELTS Reading Mastery",
    category: "IELTS",
    type: "Course",
    price: 39,
    level: "Intermediate",
    lessons: 60,
    duration: "15 hours",
    description:
      "Improve your IELTS reading skills with strategies, practice lessons, vocabulary, and reading exercises.",
    image: "",
  },

  {
    id: 3,
    title: "English Conversation Course",
    category: "Conversation",
    type: "Course",
    price: 35,
    level: "Intermediate",
    lessons: 50,
    duration: "12 hours",
    description:
      "Develop your speaking skills with practical English conversations, useful expressions, and real-life situations.",
    image: "",
  },

  // =========================
  // EBOOKS
  // =========================

  {
    id: 4,
    title: "English Vocabulary Builder",
    category: "Vocabulary",
    type: "eBook",
    price: 12,
    pages: 150,
    description:
      "Build your English vocabulary with useful words, examples, exercises, and practical learning activities.",
    image: "",
  },

  {
    id: 5,
    title: "English Conversation Guide",
    category: "Conversation",
    type: "eBook",
    price: 15,
    pages: 110,
    description:
      "Learn useful English conversation phrases and expressions for everyday communication.",
    image: "",
  },

  {
    id: 6,
    title: "English Stories for Beginners",
    category: "Stories",
    type: "eBook",
    price: 11,
    pages: 95,
    description:
      "An eBook of simple English stories designed for beginner learners.",
    image: "",
  },

  {
    id: 7,
    title: "IELTS Vocabulary eBook",
    category: "IELTS",
    type: "eBook",
    price: 14,
    pages: 180,
    description:
      "Build the vocabulary you need for IELTS with useful words, examples, and practice activities.",
    image: "",
  },

  // =========================
  // PDFs
  // =========================

  {
    id: 8,
    title: "English Grammar Practice PDF",
    category: "Grammar",
    type: "PDF",
    price: 7,
    pages: 80,
    description:
      "A practical grammar workbook containing exercises for improving your English grammar.",
    image: "",
  },

  {
    id: 9,
    title: "English Stories Collection",
    category: "Stories",
    type: "PDF",
    price: 9,
    pages: 120,
    description:
      "A collection of English stories designed to improve reading comprehension and vocabulary.",
    image: "",
  },

  {
    id: 10,
    title: "IELTS Writing Practice PDF",
    category: "IELTS",
    type: "PDF",
    price: 10,
    pages: 95,
    description:
      "Practice IELTS Writing Task 1 and Task 2 with useful examples, exercises, and writing strategies.",
    image: "",
  },

  {
    id: 11,
    title: "Everyday English Vocabulary PDF",
    category: "Vocabulary",
    type: "PDF",
    price: 6,
    pages: 70,
    description:
      "Learn useful everyday vocabulary with examples and practical exercises.",
    image: "",
  },
];

export default function Shop() {
  const [products] = useState(sampleProducts);

  // =========================
  // FILTER STATE
  // =========================

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("all");

  // =========================
  // SELECTED PRODUCT
  // =========================

  const [selectedProduct, setSelectedProduct] = useState(null);

  // =========================
  // CATEGORIES
  // =========================

  const categories = useMemo(() => {
    return [...new Set(products.map((product) => product.category))];
  }, [products]);

  // =========================
  // FILTER PRODUCTS
  // =========================

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        product.title.toLowerCase().includes(searchText) ||
        product.description.toLowerCase().includes(searchText) ||
        product.category.toLowerCase().includes(searchText);

      const matchesCategory =
        category === "all" ||
        product.category === category;

      const matchesType =
        type === "all" ||
        product.type === type;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesType
      );
    });
  }, [products, search, category, type]);

  // =========================
  // ADD TO CART
  // =========================

  const handleAddToCart = (product) => {
    console.log("Add to cart:", product);

    alert(
      `"${product.title}" will be added to your cart.`
    );
  };

  // =========================
  // CLOSE DETAILS
  // =========================

  const handleCloseDetails = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* =========================================
          HERO SECTION
      ========================================== */}

      <section className="bg-white border-b">

        <div className="max-w-7xl mx-auto px-6 py-12">

          <p className="text-blue-600 font-semibold mb-2">
            English Learning Store
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Learn More. Improve Faster.
          </h1>

          <p className="text-gray-600 max-w-2xl text-lg">
            Explore courses, PDFs, and eBooks designed
            to help you improve your English skills.
          </p>

        </div>

      </section>

      {/* =========================================
          SHOP CONTENT
      ========================================== */}

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Filters */}

        <ProductFilters
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          type={type}
          setType={setType}
          categories={categories}
        />

        {/* =========================================
            RESULTS HEADER
        ========================================== */}

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-2xl font-bold">
            Products
          </h2>

          <p className="text-gray-500">
            {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""}
          </p>

        </div>

        {/* =========================================
            NO RESULTS
        ========================================== */}

        {filteredProducts.length === 0 ? (

          <div className="bg-white border rounded-xl p-12 text-center">

            <div className="text-5xl mb-4">
              🔍
            </div>

            <h3 className="text-xl font-bold mb-2">
              No products found
            </h3>

            <p className="text-gray-500">
              Try changing your search or filters.
            </p>

          </div>

        ) : (

          /* =========================================
             PRODUCT GRID
          ========================================== */

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredProducts.map((product) => {

              // =========================
              // PDF PRODUCT
              // =========================

              if (product.type === "PDF") {
                return (
                  <PDFProductCard
                    key={product.id}
                    product={product}
                    onView={setSelectedProduct}
                  />
                );
              }

              // =========================
              // EBOOK PRODUCT
              // =========================

              if (product.type === "eBook") {
                return (
                  <EBookProductCard
                    key={product.id}
                    product={product}
                    onView={setSelectedProduct}
                  />
                );
              }

              // =========================
              // COURSE PRODUCT
              // =========================

              if (product.type === "Course") {
                return (
                  <CourseProductCard
                    key={product.id}
                    product={product}
                    onView={setSelectedProduct}
                  />
                );
              }

              // =========================
              // DEFAULT PRODUCT
              // =========================

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  onView={setSelectedProduct}
                />
              );
            })}

          </div>

        )}

      </main>

      {/* =========================================
          REGULAR PRODUCT DETAILS
      ========================================== */}

      {selectedProduct &&
        selectedProduct.type !== "PDF" &&
        selectedProduct.type !== "eBook" &&
        selectedProduct.type !== "Course" && (

          <ProductDetails
            product={selectedProduct}
            onClose={handleCloseDetails}
            onAddToCart={handleAddToCart}
          />

        )}

      {/* =========================================
          PDF DETAILS
      ========================================== */}

      {selectedProduct &&
        selectedProduct.type === "PDF" && (

          <PDFProductDetails
            product={selectedProduct}
            onClose={handleCloseDetails}
            onAddToCart={handleAddToCart}
          />

        )}

      {/* =========================================
          EBOOK DETAILS
      ========================================== */}

      {selectedProduct &&
        selectedProduct.type === "eBook" && (

          <EBookProductDetails
            product={selectedProduct}
            onClose={handleCloseDetails}
            onAddToCart={handleAddToCart}
          />

        )}

      {/* =========================================
          COURSE DETAILS
      ========================================== */}

      {selectedProduct &&
        selectedProduct.type === "Course" && (

          <CourseProductDetails
            product={selectedProduct}
            onClose={handleCloseDetails}
            onAddToCart={handleAddToCart}
          />

        )}

    </div>
  );
}