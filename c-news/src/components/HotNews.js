"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { getHotArticles } from "../lib/api.js"

/**
 * Hot News Component
 * @param {Object} props
 * @param {number} [props.limit=5] - number of news to show
 * @param {string} [props.excludeSlug] - exclude article by slug
 */
export function HotNews({ limit = 5, excludeSlug }) {
  const [hotArticles, setHotArticles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHotNews = async () => {
      try {
        // Try to get hot news, if not available - get regular articles
        let res = await fetch("https://admin.ilkin.site/api/articles/hot/")

        if (!res.ok) {
          // Fallback to regular articles
          res = await fetch("https://admin.ilkin.site/api/articles/")
        }

        const data = await res.json()
        let articles = data.results || data || []

        // Exclude current article if excludeSlug is provided
        if (excludeSlug) {
          articles = articles.filter((article) => article.slug !== excludeSlug)
        }

        // Limit the number of articles
        setHotArticles(articles.slice(0, limit))
      } catch (err) {
        console.error("Error loading hot news:", err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHotNews()
  }, [limit, excludeSlug])

  if (isLoading) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="text-red-500 mr-2">🔥</span>
          Hot News
        </h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-4 rounded mb-2"></div>
              <div className="bg-gray-200 h-3 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error || hotArticles.length === 0) {
    return null
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <span className="text-red-500 mr-2 animate-pulse">🔥</span>
        Hot News
      </h3>
      <div className="space-y-4">
        {hotArticles.map((article, index) => (
          <Link
            key={article.id}
            href={`/post/${article.slug}`}
            className="block group hover:bg-blue-50 p-3 rounded-lg transition-colors"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {index + 1}
              </div>
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
      <div className="mt-4 pt-4 border-t border-gray-200">
        <Link href="/list" className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
          All News →
        </Link>
      </div>
    </div>
  )
}
