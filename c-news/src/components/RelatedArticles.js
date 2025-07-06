"use client"

import Link from "next/link"
import { useState, useEffect } from "react"

/**
 * Related Articles Component
 * @param {Object} props
 * @param {string} props.currentSlug - current article slug
 * @param {number} [props.limit=3] - number of articles
 */
export function RelatedArticles({ currentSlug, limit = 3 }) {
  const [relatedArticles, setRelatedArticles] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRelatedArticles = async () => {
      try {
        const res = await fetch("https://admin.ilkin.site/api/articles/")
        const data = await res.json()
        let articles = data.results || data || []

        // Exclude current article and get random ones
        articles = articles
          .filter((article) => article.slug !== currentSlug)
          .sort(() => Math.random() - 0.5)
          .slice(0, limit)

        setRelatedArticles(articles)
      } catch (err) {
        console.error("Error loading related articles:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRelatedArticles()
  }, [currentSlug, limit])

  if (isLoading) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Related Articles</h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-20 rounded mb-2"></div>
              <div className="bg-gray-200 h-4 rounded mb-1"></div>
              <div className="bg-gray-200 h-3 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (relatedArticles.length === 0) {
    return null
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <span className="text-blue-500 mr-2">📚</span>
        Related Articles
      </h3>
      <div className="space-y-4">
        {relatedArticles.map((article) => (
          <Link
            key={article.id}
            href={`/post/${article.slug}`}
            className="block group hover:bg-blue-50 p-3 rounded-lg transition-colors"
          >
            <div className="flex space-x-3">
              {article.featured_image && (
                <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                  <img
                    src={article.featured_image || "/placeholder.svg"}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      e.target.style.display = "none"
                    }}
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-800 group-hover:text-blue-600 line-clamp-2 transition-colors">
                  {article.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(article.publish_date).toLocaleDateString("en-US")}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
