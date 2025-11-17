/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect, useMemo } from "react";

// Placeholder for a toast notification library (e.g., react-toastify)
const showToast = (message, type) => {
  console.log(`[${type}] ${message}`);
};

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products.");
      const data = await res.json();
      setProducts(data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      showToast("❌ Failed to load products.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete product.");

      setProducts(products.filter((p) => p.id !== id));
      showToast("🗑️ Product deleted successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast("❌ Failed to delete product.", "error");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(products.map((p) => p.category || "Uncategorized"))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    let list = products;
    if (search) {
      list = list.filter((p) =>
        p.title?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (selectedCategory !== "All") {
      list = list.filter((p) => p.category === selectedCategory);
    }
    setCurrentPage(1);
    return list;
  }, [products, search, selectedCategory]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <span className="text-blue-600 text-lg animate-pulse">Loading products...</span>
      </div>
    );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800">🛍️ Product Catalog</h1>
          <a
            href={`/products/create`}
            className="mt-4 sm:mt-0 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium shadow-lg"
          >
            ➕ Add Product
          </a>
        </header>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-6 items-center mb-8">
          <input
            type="text"
            placeholder="Search products..."
            className="flex-grow w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

         
            <div className="flex-shrink-0 flex flex-wrap gap-2 md:gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all shadow-sm ${
                    selectedCategory === cat
                      ? "bg-blue-600 text-white scale-105"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
        </div>

        {/* Product List */}
        {currentProducts.length ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentProducts.map((p) => (
             
                <li key={p.id} className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden transform hover:-translate-y-1">
                <a href={`/products/${p.id}`} className="block relative overflow-hidden h-56 w-full group">
                  <img
                    src={p.image || p.imageUrl}
                    alt={p.title || p.name}
                    className="w-full h-full object-contain bg-gray-50 transition duration-500 group-hover:scale-105"
                  />
                  {p.category && (
                    <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-md">
                      {p.category}
                    </span>
                  )}
                </a>
                
                <div className="p-5 flex flex-col flex-grow">
                  <h2 className="text-lg font-semibold text-gray-800 mb-1 truncate">{p.title || p.name}</h2>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2 min-h-[3rem]">{p.description}</p>
                  
                  {p.rating && (
                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex text-yellow-400">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={i} className={i < Math.round(p.rating.rate) ? "" : "opacity-30"}>★</span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 ml-1">({p.rating.count} reviews)</span>
                    </div>
                  )}

                  <div className="mt-auto flex items-center justify-between gap-2">
                    <span className="text-xl font-bold text-gray-800">${p.price}</span>
                    <div className="flex gap-2">
                       <a href={`/products/${p.id}`} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.575 3.01 9.963 7.181a1.012 1.012 0 010 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.575-3.01-9.963-7.181z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                       </a>
                      <a href={`/products/${p.id}/edit`} className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </a>
                      <button onClick={() => handleDelete(p.id)} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No products found.</p>
        )}

        {/* Pagination */}
        <div className="mt-12 flex justify-center items-center gap-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300"
          >
            Previous
          </button>
          <span className="font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300"
          >
            Next
          </button>
        </div>

        <footer className="mt-16 text-center text-gray-400">
        </footer>
      </div>
    </div>
  );
}
