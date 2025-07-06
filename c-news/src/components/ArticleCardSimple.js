"use client"

import Link from "next/link"
import { useState } from "react"
import { getAuthorName } from "../utils/authorUtils.js"

/**
 * Простая карточка статьи с обычным img тегом
 * @param {Object} props
 * @param {Article} props.article
 * @param {boolean} [props.priority=false]
 */
export function ArticleCardSimple({ article, priority = false }) {
  const [imageError, setImageError] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <article className="glass-card p-6 card-hover group">
      <Link href={`/post/${article.slug}`}>
        <div className="relative overflow-hidden rounded-xl mb-4">
          {!imageError && article.featured_image ? (
            <img
              src={article.featured_image || "/placeholder.svg"}
              alt={article.title}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              onError={handleImageError}
              loading={priority ? "eager" : "lazy"}
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-gray-600 text-2xl">📰</span>
                </div>
                <span className="text-gray-500 text-sm">Изображение недоступно</span>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {article.title}
        </h2>

        <div className="text-gray-600 mb-4 line-clamp-3" dangerouslySetInnerHTML={{ __html: article.excerpt }} />

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <time className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
              {new Date(article.publish_date).toLocaleDateString("ru-RU")}
            </time>
            <span className="text-gray-500">by {getAuthorName(article.author)}</span>
          </div>
          <span className="text-blue-600 font-medium group-hover:underline flex items-center">
            Читать далее
            <span className="ml-1 transition-transform duration-200 group-hover:translate-x-1">→</span>
          </span>
        </div>
      </Link>
    </article>
  )
}

