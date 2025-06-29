"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import config from "../../../config.js"

export default function Search() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) {
      setError("Пожалуйста, введите поисковый запрос.")
      return
    }

    setError("")
    setIsLoading(true)

    try {
      const res = await fetch(`${config.api}articles/search?query=${encodeURIComponent(query)}`)
      if (!res.ok) {
        throw new Error("Ошибка поиска")
      }
      const data = await res.json()
      setResults(data.results || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Поиск статей</h2>
          <p className="text-xl text-gray-600">Найдите интересующие вас материалы</p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto mt-4"></div>
        </div>

        <form onSubmit={handleSearch} className="glass-card p-8 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Введите ключевые слова..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="input-field pl-12"
                required
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap px-8"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Поиск...
                </span>
              ) : (
                "Найти"
              )}
            </button>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
              <span className="text-red-500 text-xl">⚠</span>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </form>

        {results.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-gray-800">Результаты поиска ({results.length})</h3>
              <span className="text-sm text-gray-500">По запросу "{query}"</span>
            </div>

            <div className="grid gap-6">
              {results.map((result, index) => (
                <article
                  key={index}
                  onClick={() => router.push(`/post/${result.slug}`)}
                  className="glass-card p-6 cursor-pointer card-hover group"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {result.featured_image && (
                      <div className="md:w-48 md:h-32 w-full h-48 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={result.featured_image || "/placeholder.svg"}
                          alt={result.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {result.title}
                      </h4>
                      <div
                        className="text-gray-600 mb-4 line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: result.excerpt }}
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {new Date(result.publish_date).toLocaleDateString("ru-RU")}
                        </span>
                        <span className="text-blue-600 font-medium group-hover:underline">Читать далее →</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {query && results.length === 0 && !isLoading && !error && (
          <div className="text-center py-12">
            <div className="glass-card p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Ничего не найдено</h3>
              <p className="text-gray-600 mb-4">По запросу "{query}" статей не найдено</p>
              <button
                onClick={() => {
                  setQuery("")
                  setResults([])
                }}
                className="btn-secondary"
              >
                Очистить поиск
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
