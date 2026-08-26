import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import Hero from "@/components/Hero";
import PromoBanner from "@/components/PromoBanner";
import ProductCard from "@/components/ProductCard";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  stock?: number;
}

/* ── Skeletons ──────────────────────────────────────────── */

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="aspect-square animate-pulse bg-gray-200" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="h-5 w-1/3 animate-pulse rounded bg-gray-200" />
        <div className="h-5 w-1/4 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
}

function SectionSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

/* ── Featured Categories ────────────────────────────────── */

const categories = [
  { name: "Clothing", icon: "👕", color: "from-pink-500 to-rose-500" },
  { name: "Electronics", icon: "⚡", color: "from-blue-500 to-cyan-500" },
  { name: "Home", icon: "🏠", color: "from-amber-500 to-yellow-500" },
  { name: "Sports", icon: "⚽", color: "from-green-500 to-emerald-500" },
];

function FeaturedCategories() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
        Shop by Category
      </h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            to="/products"
            className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div
              className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${cat.color} text-2xl text-white shadow-sm`}
            >
              {cat.icon}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{cat.name}</p>
              <p className="text-xs text-gray-500 transition group-hover:text-gray-700">
                Browse
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ── Main Home Page ─────────────────────────────────────── */

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { data } = await api.get("/products");
        if (!cancelled) setProducts(data);
      } catch {
        if (!cancelled) setError("Failed to load products");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const featured = products.slice(0, 8);

  return (
    <div>
      <PromoBanner />
      <Hero />
      <FeaturedCategories />

      {/* Product Grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            Featured Products
          </h2>
          <Link
            to="/products"
            className="hidden text-sm font-medium text-gray-600 transition hover:text-gray-900 sm:inline"
          >
            View all →
          </Link>
        </div>

        {error && (
          <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-200">
            {error}
          </div>
        )}

        <div className="mt-6">
          {loading ? (
            <SectionSkeleton />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

        {!loading && featured.length === 0 && !error && (
          <p className="mt-12 text-center text-sm text-gray-500">
            No products yet. Check back soon!
          </p>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/products"
            className="inline-flex items-center rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            View All Products
          </Link>
        </div>
      </section>
    </div>
  );
}
