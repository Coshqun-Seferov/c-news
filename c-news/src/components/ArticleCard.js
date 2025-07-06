"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { getAuthorName } from "../utils/authorUtils.js"

/**
 * Article Card Component
 * @param {Object} props
 * @param {Article} props.article
 * @param {boolean} [props.priority=false]
 */
export function ArticleCard({ article, priority = false }) {
  const [imageError, setImageError] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <article className="glass-card p-6 card-hover group">
      <Link href={`/post/${article.slug}`}>
        <div className="relative overflow-hidden rounded-xl mb-4">
          {!imageError && article.featured_image ? (
            <Image
              src={article.featured_image || "/placeholder.svg"}
              alt={article.title}
              width={400}
              height={200}
              priority={priority}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-gray-600 text-2xl">📰</span>
                </div>
                <span className="text-gray-500 text-sm">Image unavailable</span>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Category Badge */}
          {article.category && (
            <div className="absolute top-3 left-3">
              <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                {article.category.name}
              </span>
            </div>
          )}

          {/* View Count */}
          <div className="absolute top-3 right-3">
            <span className="bg-black/50 text-white px-2 py-1 rounded-full text-xs flex items-center">
              👁 {article.view_count || 0}
            </span>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {article.title}
        </h2>

        <div className="text-gray-600 mb-4 line-clamp-3" dangerouslySetInnerHTML={{ __html: article.excerpt }} />

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {article.tags.slice(0, 2).map((tag) => (
              <span key={tag.id} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <time className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
              {new Date(article.publish_date).toLocaleDateString("en-US")}
            </time>
            <span className="text-gray-500">by {getAuthorName(article.author)}</span>
          </div>
          <span className="text-blue-600 font-medium group-hover:underline flex items-center">
            Read more
            <span className="ml-1 transition-transform duration-200 group-hover:translate-x-1">→</span>
          </span>
        </div>
      </Link>
    </article>
  )
}
