"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CategoryMenu() {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("https://admin.ilkin.site/api/categories/");
        const data = await res.json();
        setCategories(data.results || data);
      } catch (err) {
        console.error("Ошибка загрузки категорий:", err);
      }
    }

    fetchCategories();
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setOpen(!open)}
        className="text-black bg-white border px-3 py-2 rounded shadow-md hover:bg-gray-100"
      >
        ☰
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg p-4 space-y-2">
          <h3 className="text-lg font-semibold mb-2">Категории</h3>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="block text-blue-600 hover:underline"
              onClick={() => setOpen(false)} 
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}