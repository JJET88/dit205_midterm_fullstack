import Link from 'next/link'
import React from 'react'

export default function Header() {
  return (
     <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-3xl font-bold mb-2">
                🛍️ Product Store
              </h1>
              <p className="text-indigo-100 text-sm sm:text-base">Browse our collection</p>
            </div>
            <Link
              href="/products/create"
              className="px-5 py-2.5 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-all"
            >
              + Add Product
            </Link>
          </div>
        </div>
      </div>
  )
}
