import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: Props) {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleCheckout = () => {
    onClose();
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-xl transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Cart ({items.length})
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
            Your cart is empty.
          </div>
        ) : (
          <ul className="flex-1 divide-y divide-gray-100 overflow-y-auto px-5">
            {items.map(({ product, quantity }) => (
              <li key={product.id} className="flex gap-4 py-5">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25a1.5 1.5 0 001.5 1.5z" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">
                      {product.name}
                    </p>
                    <button
                      onClick={() => removeItem(product.id)}
                      className="ml-2 flex-shrink-0 text-gray-400 transition hover:text-red-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-xs font-medium text-gray-600 transition hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-gray-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-xs font-medium text-gray-600 transition hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      ${(Number(product.price) * quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 px-5 py-5 space-y-4">
            <div className="flex items-center justify-between text-base font-semibold text-gray-900">
              <span>Subtotal</span>
              <span>${totalPrice().toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
