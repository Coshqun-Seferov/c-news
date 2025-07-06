"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

// Mock data as fallback
const mockFeaturedArticles = [
  {
    id: "1",
    title: "Breaking: Major Scientific Discovery Announced",
    slug: "major-scientific-discovery",
    publish_date: "2024-01-15T10:00:00Z",
    view_count: 3200,
    category: { id: "1", name: "Science", slug: "science" },
  },
  {
    id: "2",
    title: "Tech Giants Announce New Partnership",
    slug: "tech-giants-partnership",
    publish_date: "2024-01-15T08:30:00Z",
    view_count: 2800,
    category: { id: "2", name: "Technology", slug: "technology" },
  },
  {
    id: "3",
    title: "Global Climate Summit Reaches Agreement",
    slug: "climate-summit-agreement",
    publish_date: "2024-01-14T16:45:00Z",
    view_count: 2400,
    category: { id: "3", name: "Environment", slug: "environment" },
  },
  {
    id: "4",
    title: "Economic Markets Show Strong Recovery",
    slug: "markets-strong-recovery",
    publish_date: "2024-01-14T14:20:00Z",
    view_count: 2100,
    category: { id: "4", name: "Economics", slug: "economics" },
  },
]

export function FeaturedArticlesList() {
  const [articles, setArticles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchFeaturedArticles()
  }, [])

  const fetchFeaturedArticles = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("https://admin.ilkin.site/api/articles/featured/")

      if (!response.ok) {
        if (response.status === 404) {
          // Fallback to regular articles if featured endpoint doesn't exist
          const fallbackResponse = await fetch("https://admin.ilkin.site/api/articles/?limit=4")
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json()
            setArticles(fallbackData.results || fallbackData || [])
          } else {
            throw new Error("No featured articles available")
          }
        } else {
          throw new Error("Failed to load featured articles")
        }
      } else {
        const data = await response.json()
        setArticles((data.results || data || []).slice(0, 4))
      }
      setError("")
    } catch (err) {
      console.error("Error fetching featured articles:", err)
      setError("Failed to load featured articles")
      // Use mock data as fallback
      setArticles(mockFeaturedArticles)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 min-w-0">
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-3 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error && articles.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-600 text-sm mb-3">{error}</p>
        <button
          onClick={fetchFeaturedArticles}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {articles.map((article, index) => (
        <Link
          key={article.id}
          href={`/article/${article.slug}`}
          className="block group hover:bg-blue-50 p-3 rounded-lg transition-colors"
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-800 group-hover:text-blue-600 line-clamp-2 transition-colors">
                {article.title}
              </h4>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-500">{new Date(article.publish_date).toLocaleDateString()}</p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <div className="flex items-center">
                    <span className="mr-1">👁</span>
                    {article.view_count || 0}
                  </div>
                  {article.category && (
                    <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">
                      {article.category.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <Link
          href="/articles"
          className="block w-full text-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
        >
          View All Featured →
        </Link>
      </div>
    </div>
  )
}
