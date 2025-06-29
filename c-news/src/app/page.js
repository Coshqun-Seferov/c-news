"use client"
import Link from "next/link"
import Search from "./search/page"
import List from "./list/page"
import CategoryMenu from "./components/CategoryMenu"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 bg-pattern">
      {/* Header */}
      <header className="glass-card border-b border-white/20 mb-8 sticky top-0 z-30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-gradient">C-News</span>
                <p className="text-xs text-gray-500 -mt-1">Актуальные новости</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/list"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
              >
                Статьи
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
              </Link>
              <Link
                href="/search"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
              >
                Поиск
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
              </Link>
              <Link href="/login" className="btn-secondary">
                Войти
              </Link>
              <Link href="/register" className="btn-primary">
                Регистрация
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Burger Menu Component */}
      <CategoryMenu />

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center animate-fade-in-up">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gradient mb-6 leading-tight">
            Добро пожаловать в C-News
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Ваш источник актуальных новостей и интересных статей
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/list" className="btn-primary text-lg px-8 py-4">
              Читать статьи
            </Link>
            <Link href="/search" className="btn-secondary text-lg px-8 py-4">
              Найти новости
            </Link>
          </div>
        </div>
      </section>

      <Search />
      <List />

      {/* Footer */}
      <footer className="mt-20 glass-card border-t border-white/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">C</span>
                </div>
                <span className="text-xl font-bold text-gradient">C-News</span>
              </div>
              <p className="text-gray-600 mb-4 max-w-md">
                Актуальные новости, аналитические материалы и экспертные мнения в мире кибербезопасности.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Навигация</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/list" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Все статьи
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Поиск
                  </Link>
                </li>
                <li>
                  <Link href="/category/data-breaches" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Категории
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Аккаунт</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/login" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Войти
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Регистрация
                  </Link>
                </li>
                <li>
                  <Link href="/profil" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Профиль
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2024 C-News. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
