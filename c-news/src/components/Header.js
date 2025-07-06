"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext.js"
import { UserDisplay } from "./UserDisplay.js"

export function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  const [categories, setCategories] = useState([])
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch("https://admin.ilkin.site/api/categories/")
      const data = await res.json()
      setCategories(data.results || data)
    } catch (err) {
      console.error("Error loading categories:", err)
    }
  }

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
    window.location.href = "/"
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const menuItems = [
    { name: "Home", href: "/", icon: "🏠" },
    { name: "All Articles", href: "/list", icon: "📰" },
    { name: "Search", href: "/search", icon: "🔍" },
  ]

  return (
    <>
      <header className="glass-card border-b border-white/20 mb-8 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-gradient">C-News</span>
                <p className="text-xs text-gray-500 -mt-1">Latest News</p>
              </div>
            </Link>

            {/* Menu Button - Always Visible */}
            <button
              onClick={toggleMenu}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1.5">
                <div
                  className={`w-full h-0.5 bg-gray-700 rounded transition-all duration-300 ${
                    isMenuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                ></div>
                <div
                  className={`w-full h-0.5 bg-gray-700 rounded transition-all duration-300 ${
                    isMenuOpen ? "opacity-0" : ""
                  }`}
                ></div>
                <div
                  className={`w-full h-0.5 bg-gray-700 rounded transition-all duration-300 ${
                    isMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                ></div>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Menu Overlay - Always Available */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[45] animate-fade-in" onClick={closeMenu} />

          {/* Menu Panel */}
          <div className="fixed top-0 right-0 h-full w-80 max-w-[90vw] glass-card z-50 overflow-y-auto animate-slide-in-right">
            <div className="p-6">
              {/* Menu Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold">C</span>
                  </div>
                  <div>
                    <span className="text-xl font-bold text-gradient">C-News</span>
                    <p className="text-xs text-gray-500 -mt-1">Navigation Menu</p>
                  </div>
                </div>
                <button
                  onClick={closeMenu}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Close menu"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* User Info */}
              {isAuthenticated && user && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl mb-6">
                  <Link href="/profil" className="flex items-center space-x-3" onClick={closeMenu}>
                    <UserDisplay user={user} variant="full" />
                  </Link>
                </div>
              )}

              {/* Navigation Links */}
              <div className="space-y-2 mb-8">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Navigation</h3>
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center p-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
                    onClick={closeMenu}
                  >
                    <span className="text-lg mr-3 group-hover:scale-110 transition-transform">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
              </div>

              {/* Categories */}
              <div className="space-y-2 mb-8">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Categories ({categories.length})
                </h3>
                <div className="max-h-64 overflow-y-auto space-y-1 custom-scrollbar">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className="flex items-center p-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 text-sm group"
                      onClick={closeMenu}
                    >
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:bg-blue-600 transition-colors"></span>
                      <span className="truncate">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* User Actions */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Account</h3>
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Link
                      href="/profil"
                      className="flex items-center p-3 rounded-xl text-gray-700 hover:bg-green-50 hover:text-green-600 transition-all duration-200 group"
                      onClick={closeMenu}
                    >
                      <span className="text-lg mr-3 group-hover:scale-110 transition-transform">👤</span>
                      <span className="font-medium">My Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full p-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 group"
                    >
                      <span className="text-lg mr-3 group-hover:scale-110 transition-transform">🚪</span>
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      className="flex items-center p-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
                      onClick={closeMenu}
                    >
                      <span className="text-lg mr-3 group-hover:scale-110 transition-transform">🔑</span>
                      <span className="font-medium">Sign In</span>
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center p-3 rounded-xl text-gray-700 hover:bg-green-50 hover:text-green-600 transition-all duration-200 group"
                      onClick={closeMenu}
                    >
                      <span className="text-lg mr-3 group-hover:scale-110 transition-transform">📝</span>
                      <span className="font-medium">Sign Up</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 pt-6 mt-8">
                <div className="text-center">
                  <p className="text-xs text-gray-500">© 2024 C-News</p>
                  <p className="text-xs text-gray-400 mt-1">All rights reserved</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
