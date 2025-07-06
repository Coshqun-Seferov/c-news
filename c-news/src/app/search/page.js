"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Header } from "../../components/Header.js"

// Debounce function for search optimization
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default function Search() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  // Debounce query with 300ms delay
  const debouncedQuery = useDebounce(query, 300)

  // Function to perform search
  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([])
      setError("")
      setHasSearched(false)
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const res = await fetch(`https://admin.ilkin.site/api/articles/?search=${encodeURIComponent(searchQuery)}`)
      if (!res.ok) {
        throw new Error("Search error")
      }
      const data = await res.json()
      setResults(data.results || [])
      setHasSearched(true)
    } catch (err) {
      setError(err.message)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Perform search when debounced query changes
  useEffect(() => {
    performSearch(debouncedQuery)
  }, [debouncedQuery, performSearch])

  // Handle input change
  const handleInputChange = (e) => {
    setQuery(e.target.value)
  }

  // Clear search
  const clearSearch = () => {
    setQuery("")
    setResults([])
    setError("")
    setHasSearched(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 bg-pattern">
      <Header />

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Search Articles</h1>
            <p className="text-xl text-gray-600">Find the materials you're interested in</p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto mt-4" />
          </div>

          {/* Search Bar */}
          <div className="glass-card p-8 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Start typing to search..."
                  value={query}
                  onChange={handleInputChange}
                  className="input-field pl-12 pr-12"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</div>
                {query && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Loading Indicator */}
            {isLoading && (
              <div className="mt-4 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-gray-600">Searching...</span>
                </div>
              </div>
            )}

            {/* Show result count */}
            {hasSearched && !isLoading && (
              <div className="mt-4 text-center text-gray-600">
                {results.length > 0 ? (
                  <span>
                    Found {results.length} result(s) for "{query}"
                  </span>
                ) : (
                  query && <span>Nothing found for "{query}"</span>
                )}
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
                <span className="text-red-500 text-xl">⚠</span>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Search Results */}
          {results.length > 0 && (
            <div className="space-y-6">
              <div className="grid gap-6">
                {results.map((result, index) => (
                  <article
                    key={result.id || index}
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
                            onError={(e) => {
                              e.target.style.display = "none"
                            }}
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {result.title}
                        </h3>
                        <div
                          className="text-gray-600 mb-4 line-clamp-3"
                          dangerouslySetInnerHTML={{ __html: result.excerpt }}
                        />
                        <div className="flex items-center justify-between">
                          <time className="text-sm text-gray-500 bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                            {new Date(result.publish_date).toLocaleDateString("en-US")}
                          </time>
                          <span className="text-blue-600 font-medium group-hover:underline">Read more →</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* No results message */}
          {hasSearched && results.length === 0 && !isLoading && !error && query && (
            <div className="text-center py-12">
              <div className="glass-card p-8 max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-400 text-2xl">🔍</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Nothing Found</h3>
                <p className="text-gray-600 mb-4">No articles found for "{query}"</p>
                <button onClick={clearSearch} className="btn-secondary">
                  Clear Search
                </button>
              </div>
            </div>
          )}

          {/* Popular queries or suggestions */}
          {!hasSearched && !query && (
            <div className="text-center py-12">
              <div className="glass-card p-8 max-w-md mx-auto">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 text-2xl">💡</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Start Searching</h3>
                <p className="text-gray-600 mb-4">Enter any word or phrase to find articles</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {["cybersecurity", "news", "technology", "analysis"].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setQuery(suggestion)}
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm hover:bg-blue-100 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
