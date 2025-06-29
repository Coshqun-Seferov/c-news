"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import config from "../../../config.js"

export default function List() {
  const router = useRouter()
  const [articles, setArticles] = useState([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch(`${config.api}articles/`)
        if (!res.ok) throw new Error("Ошибка загрузки статей")
        const data = await res.json()
        setArticles(data.results || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchArticles()
  }, [])

  if (error) {
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="glass-card p-8 text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">⚠</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Ошибка загрузки</h3>
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Попробовать снова
          </button>
        </div>
      </section>
    )
  }

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="w-32 h-8 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <div className="w-24 h-1 bg-gray-200 rounded-full mx-auto animate-pulse"></div>
        </div>
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
      </section>
    )
  }

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Последние статьи</h2>
        <p className="text-xl text-gray-600 mb-6">Актуальные новости и аналитические материалы</p>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article, index) => (
          <article
            key={article.id}
            onClick={() => router.push(`/post/${article.slug}`)}
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
              <div className="absolute top-3 right-3">
                <span className="bg-blue-600/90 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">Новое</span>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {article.title}
            </h3>

            <div
              className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.excerpt }}
            />

            <div className="flex items-center justify-between text-sm">
              <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
                {new Date(article.publish_date).toLocaleDateString("ru-RU")}
              </span>
              <span className="text-blue-600 font-medium group-hover:underline flex items-center">
                Читать далее
                <span className="ml-1 transition-transform duration-200 group-hover:translate-x-1">→</span>
              </span>
            </div>
          </article>
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center py-16">
          <div className="glass-card p-8 max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-2xl">📰</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Статьи не найдены</h3>
            <p className="text-gray-600">Пока нет опубликованных статей</p>
          </div>
        </div>
      )}
    </section>
  )
}
