import Link from "next/link"
import config from "../../../../config.js"

async function getCategoryArticles(slug) {
  const res = await fetch(`${config.api}categories/articles/?search=${slug}`, {
    cache: "no-store",
  })
  if (!res.ok) throw new Error("Не удалось загрузить статьи категории")
  const data = await res.json()
  return data.results
}

export async function generateMetadata({ params }) {
  const { slug } = await params

  return {
    title: `Категория: ${slug} | C-News`,
    description: `Статьи в категории ${slug}`,
  }
}

export default async function CategoryPage({ params }) {
  const { slug } = await params
  const articles = await getCategoryArticles(slug)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="glass-card border-b border-white/20 mb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center space-x-2 w-fit">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              C-News
            </span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline">
            Главная
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">Категория</span>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Категория: {slug}</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto"></div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article key={article.id} className="glass-card p-6 card-hover group">
              <Link href={`/post/${article.slug}`}>
                <div className="relative overflow-hidden rounded-xl mb-4">
                  <img
                    src={article.featured_image || "/placeholder.svg?height=200&width=400"}
                    alt={article.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <h2 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h2>

                <div
                  className="text-gray-600 mb-4 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: article.excerpt }}
                />

                <span className="text-blue-600 font-medium group-hover:underline">Читать далее →</span>
              </Link>
            </article>
          ))}
        </div>

        {articles.length === 0 && (
          <div className="text-center py-12">
            <div className="glass-card p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">📰</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Статьи не найдены</h3>
              <p className="text-gray-600 mb-4">В этой категории пока нет статей</p>
              <Link href="/" className="btn-primary">
                На главную
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
