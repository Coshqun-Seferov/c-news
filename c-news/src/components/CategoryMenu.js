"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "../contexts/AuthContext.js"
import { UserDisplay } from "./UserDisplay.js"
import { getCategories } from "../lib/api.js"

export function CategoryMenu() {
  const { isAuthenticated, user } = useAuth()
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadCategories() {
      try {
        const fetchedCategories = await getCategories()
        setCategories(fetchedCategories)
      } catch (error) {
        console.error("Error loading categories:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadCategories()
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
    { name: "Home", href: "/", icon: "🏠" },
    { name: "All Articles", href: "/list", icon: "📰" },
    { name: "Search", href: "/search", icon: "🔍" },
  ]

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <span className="text-purple-500 mr-2">📂</span>
        Categories
      </h3>

      {/* User Info */}
      {isAuthenticated && user && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl mb-6">
          <Link href="/profil">
            <UserDisplay user={user} variant="compact" />
          </Link>
        </div>
      )}

      {/* Categories List */}
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-8 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          <Link
            href="/list"
            className="block text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-3 rounded-lg transition-colors font-medium"
          >
            📰 All Articles
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="block text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-3 rounded-lg transition-colors"
            >
              📁 {category.name}
              {category.article_count && (
                <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {category.article_count}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Quick Links */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="space-y-2">
          <Link
            href="/search"
            className="block text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors"
          >
            🔍 Search Articles
          </Link>
          {!isAuthenticated && (
            <>
              <Link
                href="/login"
                className="block text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors"
              >
                🔐 Sign In
              </Link>
              <Link
                href="/register"
                className="block text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors"
              >
                📝 Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

