"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function CategoryMenu() {
  const [categories, setCategories] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)

    // Fetch user info if logged in
    if (token) {
      fetchUserInfo(token)
    }

    // Fetch categories
    fetchCategories()
  }, [])

  const fetchUserInfo = async (token) => {
    try {
      const res = await fetch("https://admin.ilkin.site/api/auth/profile/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      if (res.ok) {
        const userData = await res.json()
        setUser(userData)
      }
    } catch (err) {
      console.error("Ошибка загрузки пользователя:", err)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch("https://admin.ilkin.site/api/categories/")
      const data = await res.json()
      setCategories(data.results || data)
    } catch (err) {
      console.error("Ошибка загрузки категорий:", err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("refresh")
    setIsLoggedIn(false)
    setUser(null)
    setIsOpen(false)
    window.location.href = "/"
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  const menuItems = [
    { name: "Главная", href: "/", icon: "🏠" },
    { name: "Все статьи", href: "/list", icon: "📰" },
    { name: "Поиск", href: "/search", icon: "🔍" },
  ]

  return (
    <>
      {/* Burger Menu Button - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleMenu}
          className="glass-card p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
        >
          {/* Three Lines Burger Icon */}
          <div className="w-6 h-6 flex flex-col justify-center space-y-1.5">
            <div
              className={`w-full h-0.5 bg-gray-700 rounded transition-all duration-300 ${
                isOpen ? "rotate-45 translate-y-2" : ""
              }`}
            ></div>
            <div
              className={`w-full h-0.5 bg-gray-700 rounded transition-all duration-300 ${isOpen ? "opacity-0" : ""}`}
            ></div>
            <div
              className={`w-full h-0.5 bg-gray-700 rounded transition-all duration-300 ${
                isOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></div>
          </div>
        </button>
      </div>

      {/* Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in" onClick={closeMenu} />

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
                    <p className="text-xs text-gray-500 -mt-1">Меню навигации</p>
                  </div>
                </div>
                <button
                  onClick={closeMenu}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Закрыть меню"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* User Info */}
              {isLoggedIn && user && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl mb-6">
                  <div className="flex items-center space-x-3">
                    <img
                      src={user.profile_picture || "/placeholder.svg?height=40&width=40"}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{user.username}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <div className="space-y-2 mb-8">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Навигация</h3>
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
                  Категории ({categories.length})
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
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Аккаунт</h3>
                {isLoggedIn ? (
                  <div className="space-y-2">
                    <Link
                      href="/profil"
                      className="flex items-center p-3 rounded-xl text-gray-700 hover:bg-green-50 hover:text-green-600 transition-all duration-200 group"
                      onClick={closeMenu}
                    >
                      <span className="text-lg mr-3 group-hover:scale-110 transition-transform">👤</span>
                      <span className="font-medium">Мой профиль</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full p-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 group"
                    >
                      <span className="text-lg mr-3 group-hover:scale-110 transition-transform">🚪</span>
                      <span className="font-medium">Выйти</span>
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
                      <span className="font-medium">Войти</span>
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center p-3 rounded-xl text-gray-700 hover:bg-green-50 hover:text-green-600 transition-all duration-200 group"
                      onClick={closeMenu}
                    >
                      <span className="text-lg mr-3 group-hover:scale-110 transition-transform">📝</span>
                      <span className="font-medium">Регистрация</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 pt-6 mt-8">
                <div className="text-center">
                  <p className="text-xs text-gray-500">© 2024 C-News</p>
                  <p className="text-xs text-gray-400 mt-1">Все права защищены</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
