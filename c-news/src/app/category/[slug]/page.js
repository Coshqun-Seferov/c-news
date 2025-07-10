import Link from "next/link"
import { Header } from "../../../components/Header.js"
import { getArticles, getCategories } from "../../../lib/api.js"

async function getCategoryArticles(slug) {
  try {
    // Получаем все статьи и фильтруем на клиенте
    const data = await getArticles()
    const allArticles = data.results || data || []

    // Фильтруем статьи по slug категории
    const categoryArticles = allArticles.filter(
      (article) =>
        article.category &&
        (article.category.slug === slug || article.category.name.toLowerCase() === slug.toLowerCase()),
    )

    return categoryArticles
  } catch (error) {
    console.error("Error fetching category articles:", error)
    return []
  }
}

async function getCategoryInfo(slug) {
  try {
    const categories = await getCategories()
    const category = categories.find((cat) => cat.slug === slug || cat.name.toLowerCase() === slug.toLowerCase())

    if (category) {
      return category
    }

    // Fallback если категория не найдена
    return {
      name: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " "),
      slug: slug,
      description: `Articles in ${slug} category`,
    }
  } catch (error) {
    console.error("Error fetching category info:", error)
    return {
      name: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " "),
      slug: slug,
      description: "",
    }
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params

  try {
    const category = await getCategoryInfo(slug)
    return {
      title: `${category.name || slug} | C-News`,
      description: category.description || `Articles in ${category.name || slug} category`,
    }
  } catch (error) {
    return {
      title: `${slug} | C-News`,
      description: `Articles in ${slug} category`,
    }
  }
}

export default async function CategoryPage({ params }) {
  const { slug } = await params

  let articles = []
  let categoryInfo = { name: slug, description: "" }
  let error = null

  try {
    const [articlesData, categoryData] = await Promise.all([getCategoryArticles(slug), getCategoryInfo(slug)])

    articles = articlesData
    categoryInfo = categoryData
  } catch (err) {
    console.error("Error loading category page:", err)
    error = err.message
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/list" className="text-blue-600 hover:text-blue-800 transition-colors">
              Articles
            </Link>
            <span>/</span>
            <span className="text-gray-800">{categoryInfo.name || slug}</span>
          </div>
        </nav>

        {/* Error Message */}
        {error && (
          <div className="mb-8">
            <div className="glass-card p-6 border-l-4 border-yellow-500">
              <div className="flex items-center">
                <span className="text-yellow-500 mr-2">⚠️</span>
                <p className="text-gray-700">There was an issue loading some data, but we'll show what we can.</p>
              </div>
            </div>
          </div>
        )}

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{categoryInfo.name || slug}</h1>
          {categoryInfo.description && (
            <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">{categoryInfo.description}</p>
          )}
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto"></div>

          {articles.length > 0 && (
            <p className="text-gray-500 mt-4">
              {articles.length} article{articles.length !== 1 ? "s" : ""} found
            </p>
          )}
        </div>

        {/* Articles Grid */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <article
                key={article.id}
                className="glass-card p-6 card-hover group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Link href={`/article/${article.slug}`}>
                  <div className="relative overflow-hidden rounded-xl mb-4">
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

                    {/* View count */}
                    <div className="absolute top-3 right-3">
                      <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm flex items-center">
                        <span className="mr-1">👁</span>
                        {article.view_count || 0}
                      </span>
                    </div>
                  </div>

                  <h2 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h2>

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
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="glass-card p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">📰</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Articles Found</h3>
              <p className="text-gray-600 mb-4">
                {error ? "There was an error loading articles for this category." : "No articles in this category yet."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/" className="btn-primary">
                  Go Home
                </Link>
                <Link href="/list" className="btn-secondary">
                  All Articles
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Back to categories */}
        <div className="text-center mt-12">
          <Link href="/list" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            ← Back to All Articles
          </Link>
        </div>
      </div>
    </div>
  )
}

