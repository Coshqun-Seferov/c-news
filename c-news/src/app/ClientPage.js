"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { getArticles, getCategories, getSiteSettings } from "../lib/api.js"
import { ArticleCard } from "../components/ArticleCard.js"
import { Header } from "../components/Header.js"
import { HotCarousel } from "../components/hot-carousel.jsx"
import { FeaturedCarousel } from "../components/featured-carousel.jsx"
import { NewsletterSubscription } from "../components/NewsletterSubscription.js"

export default function ClientPage() {
  const [articles, setArticles] = useState([])
  const [categories, setCategories] = useState([])
  const [siteSettings, setSiteSettings] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadData() {
      try {
        const [articlesData, fetchedCategories, settings] = await Promise.all([
          getArticles(),
          getCategories(),
          getSiteSettings(),
        ])

        // Извлекаем статьи из ответа API
        const allArticles = articlesData.results || articlesData || []
        setArticles(allArticles)
        setCategories(fetchedCategories)
        setSiteSettings(settings)
      } catch (err) {
        console.error("Error loading data:", err)
        setError(err.message)
      }
    }
    loadData()
  }, [])

  // Фильтруем featured статьи для основного контента
  const featuredArticles = articles.filter((article) => article.is_featured).slice(0, 6)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 bg-pattern">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center animate-fade-in-up">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gradient mb-6 leading-tight">
            Welcome to {siteSettings?.site_name || "C-News"}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            {siteSettings?.site_description || "Your source for the latest news and interesting articles"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/list" className="btn-primary text-lg px-8 py-4">
              Read Articles
            </Link>
            <Link href="/search" className="btn-secondary text-lg px-8 py-4">
              Find News
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Articles */}
            <section>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Featured Articles</h2>
                <p className="text-xl text-gray-600 mb-6">Latest news and analytical materials</p>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto" />
              </div>

              {error ? (
                <div className="text-center py-12">
                  <div className="glass-card p-8 max-w-md mx-auto">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-red-500 text-2xl">⚠</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Error</h3>
                    <p className="text-red-500 mb-4">{error}</p>
                    <button onClick={() => window.location.reload()} className="btn-primary">
                      Try Again
                    </button>
                  </div>
                </div>
              ) : featuredArticles.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {featuredArticles.map((article, index) => (
                      <ArticleCard key={article.id} article={article} priority={index < 2} />
                    ))}
                  </div>
                  <div className="text-center mt-12">
                    <Link href="/list" className="btn-primary">
                      View All Articles
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="glass-card p-8 max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-gray-400 text-2xl">📰</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Featured Articles</h3>
                    <p className="text-gray-600">No featured articles available yet</p>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar - выровнен по верху с основным контентом */}
          <div className="lg:col-span-1">
            {/* Отступ для выравнивания с заголовком Featured Articles */}
            <div className="hidden lg:block mb-12">
              {/* Пустой блок для выравнивания с заголовком основного контента */}
              <div className="h-24"></div>
            </div>

            <div className="sidebar-carousels space-y-6">
              {/* Hot News Carousel */}
              <div className="carousel-container">
                <HotCarousel />
              </div>

              {/* Featured Articles Carousel */}
              <div className="carousel-container">
                <FeaturedCarousel />
              </div>
            </div>

            {/* Other sidebar widgets */}
            <div className="space-y-6 mt-6">
              {/* Newsletter Subscription */}
              <NewsletterSubscription />

              {/* Categories Widget */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="text-blue-500 mr-2">📂</span>
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.slice(0, 5).map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${category.slug}`}
                      className="block text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Stats Widget */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="text-green-500 mr-2">📊</span>
                  Statistics
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Total Articles</span>
                    <span className="font-semibold text-gray-800">{articles.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Categories</span>
                    <span className="font-semibold text-blue-600">{categories.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Featured</span>
                    <span className="font-semibold text-blue-600">
                      {articles.filter((article) => article.is_featured).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Hot News</span>
                    <span className="font-semibold text-red-600">
                      {articles.filter((article) => article.is_hot).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Total Views</span>
                    <span className="font-semibold text-green-600">
                      {articles.reduce((sum, article) => sum + (article.view_count || 0), 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 glass-card border-t border-white/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                {siteSettings?.logo ? (
                  <img src={siteSettings.logo || "/placeholder.svg"} alt="Logo" className="w-10 h-10 rounded-xl" />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold">C</span>
                  </div>
                )}
                <span className="text-xl font-bold text-gradient">{siteSettings?.site_name || "C-News"}</span>
              </div>
              <p className="text-gray-600 mb-4 max-w-md">
                {siteSettings?.site_description ||
                  "Latest news, analytical materials and expert opinions in the world of cybersecurity."}
              </p>
              {siteSettings?.contact_email && (
                <p className="text-gray-600 text-sm">
                  Contact:{" "}
                  <a href={`mailto:${siteSettings.contact_email}`} className="text-blue-600 hover:underline">
                    {siteSettings.contact_email}
                  </a>
                </p>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Navigation</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/list" className="text-gray-600 hover:text-blue-600 transition-colors">
                    All Articles
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Search
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Account</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/login" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link href="/profil" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Profile
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2024 {siteSettings?.site_name || "C-News"}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
