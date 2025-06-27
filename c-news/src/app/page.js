"use client";
import React from "react";
import Link from "next/link";
import Search from "./search/page";
import List from "./list/page";
import CategoryMenu from "./components/CategoryMenu";

export default function Home() {
  return (
    <>
      <CategoryMenu />
      <Search />
      <List />
      <div className="text-center mt-8">
        <Link href="/category/data-breaches" className="text-blue-600 hover:underline">
          Go to Category
        </Link>
      </div>
    </>
  );
}
