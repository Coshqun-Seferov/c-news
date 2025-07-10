"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "../../components/Header.js"
import { getArticles } from "../../lib/api.js"

export default function List() {
  const router = useRouter()
  const [articles, setArticles] = useState([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    fetchArticles(currentPage)
  }, [currentPage])

  const fetchArticles = async (page = 1) => {
    try {
      setIsLoading(true)
      const data = await getArticles({
        page: page,
        limit: 12,
      })

      setArticles(data.results || data || [])
      setTotalCount(data.count || 0)
      setTotalPages(Math.ceil((data.count || 0) / 12))
      setError("")
    } catch (err) {
      console.error("Error fetching articles:", err)
      setError(err.message || "Failed to load articles")
    } finally {
      setIsLoading(false)
    }
  }

  const handleArticleClick = (article) => {
    router.push(`/article/${article.slug}`)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <Header />
        <section className="container mx-auto px-4 py-16">
          <div className="glass-card p-8 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">⚠</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Error</h3>
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={() => fetchArticles(currentPage)} className="btn-primary">
              Try Again
            </button>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Header />

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">All Articles</h1>
          <p className="text-xl text-gray-600 mb-6">Latest news and analytical materials</p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto"></div>

          {/* Articles count */}
          {totalCount > 0 && (
            <p className="text-gray-500 mt-4">
              Showing {articles.length} of {totalCount} articles
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="bg-gray-200 h-48 rounded-xl mb-4"></div>
                <div className="bg-gray-200 h-6 rounded mb-3"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, index) => (
                <article
                  key={article.id}
                  onClick={() => handleArticleClick(article)}
                  className="glass-card p-6 cursor-pointer card-hover group animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative overflow-hidden rounded-xl mb-6">
                    <img
                      src={article.featured_image || "/placeholder.svg?height=200&width=400"}
                      alt={article.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex space-x-2">
                      {article.is_hot && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm flex items-center">
                          <span className="mr-1">🔥</span>
                          HOT
                        </span>
                      )}
                      {article.is_featured && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm flex items-center">
                          <span className="mr-1">⭐</span>
                          FEATURED
                        </span>
                      )}
                    </div>

                    {/* Category */}
                    {article.category && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-gray-600/90 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                          {article.category.name}
                        </span>
                      </div>
                    )}

                    {/* View count */}
                    <div className="absolute bottom-3 right-3">
                      <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm flex items-center">
                        <span className="mr-1">👁</span>
                        {article.view_count || 0}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>

                  <div
                    className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: article.excerpt }}
                  />

                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {article.tags.slice(0, 2).map((tag) => (
                        <span key={tag.id} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-3">
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
                        {new Date(article.publish_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="text-gray-500">by {article.author}</span>
                    </div>
                    <span className="text-blue-600 font-medium group-hover:underline flex items-center">
                      Read more
                      <span className="ml-1 transition-transform duration-200 group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-12">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ← Previous
                </button>

                <div className="flex space-x-1">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = i + 1
                    const isActive = pageNum === currentPage

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}

        {articles.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <div className="glass-card p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">📰</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Articles Found</h3>
              <p className="text-gray-600">No published articles available yet</p>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
