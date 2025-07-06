import ClientPage from "./ClientPage"

export const metadata = {
  title: "C-News | Актуальные новости и статьи",
  description: "Ваш источник актуальных новостей, интересных статей и аналитических материалов",
}

export default async function HomePage() {
  return <ClientPage />
}

function ArticleGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="glass-card p-6 animate-pulse">
          <div className="bg-gray-200 h-48 rounded-xl mb-4"></div>
          <div className="bg-gray-200 h-6 rounded mb-3"></div>
          <div className="bg-gray-200 h-4 rounded mb-2"></div>
          <div className="bg-gray-200 h-4 rounded w-3/4"></div>
        </div>
      ))}
    </div>
  )
}

function SidebarSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="glass-card p-6 animate-pulse">
          <div className="bg-gray-200 h-6 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="bg-gray-200 h-4 rounded"></div>
            <div className="bg-gray-200 h-4 rounded"></div>
            <div className="bg-gray-200 h-4 rounded w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  )
}
