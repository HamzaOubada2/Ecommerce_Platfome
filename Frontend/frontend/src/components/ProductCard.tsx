import { Link } from "react-router-dom";
import { useCartStore } from "@/store/useCartStore";
import { useCartFeedback } from "@/hooks/useCartFeedback";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  stock?: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const { feedback, trigger } = useCartFeedback();

  const price = Number(product.price);
  const originalPrice = product.originalPrice != null ? Number(product.originalPrice) : undefined;
  const stock = Number(product.stock ?? 0);
  const inStock = stock > 0;
  const lowStock = stock > 0 && stock <= 5;
  const hasDiscount = originalPrice != null && originalPrice > price;
  const discountPct = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handleAdd = () => {
    addItem({ id: product.id, name: product.name, price, imageUrl: product.imageUrl });
    trigger();
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg">
      {/* Image — link to detail page */}
      <Link to={`/products/${product.id}`} className="relative block aspect-square overflow-hidden bg-gray-100">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25a1.5 1.5 0 001.5 1.5z" />
            </svg>
          </div>
        )}

        {/* Discount badge */}
        {hasDiscount && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white shadow">
            -{discountPct}%
          </span>
        )}

        {/* Hover overlay Add to Cart */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center bg-gradient-to-t from-black/50 to-transparent p-4 opacity-0 translate-y-2 transition duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0">
          <button
            disabled={!inStock}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAdd();
            }}
            className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold shadow-lg transition focus:outline-none focus:ring-2 focus:ring-white disabled:cursor-not-allowed disabled:opacity-40 ${
              feedback
                ? "bg-green-500 text-white"
                : "bg-white text-gray-900 hover:bg-gray-100"
            }`}
          >
            {feedback ? "✔ Added!" : "Add to Cart"}
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="line-clamp-2 text-sm font-medium text-gray-900 transition hover:text-gray-700">{product.name}</h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <p className="text-lg font-bold text-gray-900">${price.toFixed(2)}</p>
          {hasDiscount && (
            <p className="text-sm text-gray-400 line-through">
              ${originalPrice!.toFixed(2)}
            </p>
          )}
        </div>

        {/* Stock badge */}
        <div className="mt-auto pt-1">
          {inStock && !lowStock && (
            <span className="inline-block rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-green-600/20">
              In Stock
            </span>
          )}
          {lowStock && (
            <span className="inline-block rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-600/20">
              Low Stock — {stock} left
            </span>
          )}
          {!inStock && (
            <span className="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500 ring-1 ring-gray-300">
              Out of Stock
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
