export default function ProductFilters({
  search,
  setSearch,
  category,
  setCategory,
  type,
  setType,
  categories,
}) {
  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm mb-8">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Search */}

        <div>

          <label className="block font-semibold mb-2">
            Search Products
          </label>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses, PDFs, eBooks..."
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

        {/* Category */}

        <div>

          <label className="block font-semibold mb-2">
            Category
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >

            <option value="all">
              All Categories
            </option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}

          </select>

        </div>

        {/* Product Type */}

        <div>

          <label className="block font-semibold mb-2">
            Product Type
          </label>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >

            <option value="all">
              All Products
            </option>

            <option value="Course">
              Courses
            </option>

            <option value="PDF">
              PDFs
            </option>

            <option value="eBook">
              eBooks
            </option>

          </select>

        </div>

      </div>

    </div>
  );
}