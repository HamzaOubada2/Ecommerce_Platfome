import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { useCartStore } from "@/store/useCartStore";
import { useCartFeedback } from "@/hooks/useCartFeedback";
import ImageZoom from "@/components/ImageZoom";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  stock?: number;
  category?: string;
}

const SKELETON_CLASS = "animate-pulse rounded bg-gray-200";

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Left — image */}
        <div className="aspect-square w-full rounded-2xl bg-gray-200 animate-pulse" />
        {/* Right — info */}
        <div className="flex flex-col gap-5 pt-4">
          <div className={`h-5 w-24 ${SKELETON_CLASS}`} />
          <div className={`h-9 w-3/4 ${SKELETON_CLASS}`} />
          <div className={`h-7 w-32 ${SKELETON_CLASS}`} />
          <div className={`h-4 w-full ${SKELETON_CLASS}`} />
          <div className={`h-4 w-5/6 ${SKELETON_CLASS}`} />
          <div className={`h-4 w-2/3 ${SKELETON_CLASS}`} />
          <div className="mt-4 flex gap-3">
            <div className={`h-12 w-44 ${SKELETON_CLASS}`} />
            <div className={`h-12 w-12 ${SKELETON_CLASS}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);
  const { feedback, trigger } = useCartFeedback(2000);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        if (!cancelled) setProduct(data);
      } catch {
        if (!cancelled) setError("Product not found");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <DetailSkeleton />;

  if (error || !product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <p className="text-sm text-gray-500">{error || "Product not found"}</p>
        <button onClick={() => navigate("/products")} className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800">
          Back to Products
        </button>
      </div>
    );
  }

  const price = Number(product.price);
  const originalPrice = product.originalPrice != null ? Number(product.originalPrice) : undefined;
  const stock = Number(product.stock ?? 0);
  const inStock = stock > 0;
  const lowStock = stock > 0 && stock <= 5;
  const hasDiscount = originalPrice != null && originalPrice > price;

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({ id: product.id, name: product.name, price, imageUrl: product.imageUrl });
    }
    trigger();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-gray-500">
        <button onClick={() => navigate("/products")} className="transition hover:text-gray-900">
          Products
        </button>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* ── Left: Image ──────────────────────────── */}
        <div className="flex flex-col gap-4">
          <ImageZoom
            src={product.imageUrl || ""}
            alt={product.name}
          />
          {!product.imageUrl && (
            <div className="flex aspect-square items-center justify-center rounded-2xl bg-gray-100 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25a1.5 1.5 0 001.5 1.5z" />
              </svg>
            </div>
          )}
        </div>

        {/* ── Right: Info ──────────────────────────── */}
        <div className="flex flex-col gap-6 lg:py-4">
          {/* Category */}
          {product.category && (
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
              {product.category}
            </span>
          )}

          {/* Title */}
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-gray-900">${price.toFixed(2)}</span>
            {hasDiscount && (
              <>
                <span className="text-lg text-gray-400 line-through">${originalPrice!.toFixed(2)}</span>
                <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700">
                  Save {Math.round(((originalPrice! - price) / originalPrice!) * 100)}%
                </span>
              </>
            )}
          </div>

          {/* Stock */}
          <div>
            {inStock && !lowStock && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                In Stock
              </span>
            )}
            {lowStock && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-600/20">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                Low Stock — only {stock} left
              </span>
            )}
            {!inStock && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500 ring-1 ring-gray-300">
                <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                Out of Stock
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
              {product.description.split("\n").map((para, i) => (
                <p key={i} className="mb-3">{para}</p>
              ))}
            </div>
          )}

          {/* Divider */}
          <hr className="border-gray-200" />

          {/* Quantity + Add to Cart */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Quantity selector */}
            <div className="flex items-center rounded-lg border border-gray-300">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-12 w-12 items-center justify-center text-lg font-medium text-gray-600 transition hover:bg-gray-100"
              >
                −
              </button>
              <span className="flex h-12 w-12 items-center justify-center text-sm font-semibold text-gray-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                disabled={quantity >= stock}
                className="flex h-12 w-12 items-center justify-center text-lg font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-30"
              >
                +
              </button>
            </div>

            {/* Add to Cart */}
            <button
              disabled={!inStock}
              onClick={handleAdd}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-8 py-3.5 text-sm font-semibold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 ${
                feedback
                  ? "bg-green-500 text-white"
                  : "bg-gray-900 text-white hover:bg-gray-800"
              }`}
            >
              {feedback ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Added to Cart!
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                  Add to Cart
                </>
              )}
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-2 flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H18.75m-7.5-2.25h7.5m-7.5 0H6.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125h8.25m-7.5-6V4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v3.375" />
              </svg>
              Free shipping on orders over $50
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
              </svg>
              30-day easy returns
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              Secure checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
