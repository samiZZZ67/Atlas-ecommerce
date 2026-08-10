import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { Icon } from "./Icons";

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cart, products, removeFromCart, updateQty, cartSubtotal, cartCount } = useStore();

  if (!open) return null;

  const items = cart
    .map((ci) => {
      const p = products.find((x) => x.id === ci.productId);
      return p ? { ...p, quantity: ci.quantity } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const shipping = cartSubtotal > 200 || cartSubtotal === 0 ? 0 : 18;
  const freeShipProgress = Math.max(0, 200 - cartSubtotal);

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-bone shadow-2xl flex flex-col animate-slideInRight">
        <div className="flex items-center justify-between px-6 py-5 border-b border-ink/10">
          <div className="flex items-center gap-3">
            <Icon.Bag size={20} />
            <h2 className="font-display text-xl tracking-wide">Your Bag</h2>
            <span className="text-xs text-stone">({cartCount} items)</span>
          </div>
          <button onClick={onClose} className="p-2 -mr-2 hover:opacity-60">
            <Icon.Close size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
            <div className="w-20 h-20 rounded-full bg-sand flex items-center justify-center mb-5">
              <Icon.Bag size={28} className="text-stone" />
            </div>
            <h3 className="font-display text-2xl mb-2">Your bag is empty</h3>
            <p className="text-sm text-stone mb-6">
              Explore our curated collection of the world's finest materials.
            </p>
            <button
              onClick={onClose}
              className="bg-ink text-bone px-8 py-3 text-xs tracking-[0.2em] uppercase btn-press"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {freeShipProgress > 0 ? (
              <div className="px-6 pt-5">
                <div className="text-xs text-stone mb-2">
                  You're <span className="text-clay font-medium">${freeShipProgress.toFixed(2)}</span> away
                  from free shipping
                </div>
                <div className="h-1 bg-sand rounded-full overflow-hidden">
                  <div
                    className="h-full bg-clay transition-all duration-500"
                    style={{ width: `${Math.min(100, (cartSubtotal / 200) * 100)}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="px-6 pt-5">
                <div className="text-xs bg-clay/10 text-clay border border-clay/20 px-3 py-2 text-center font-medium tracking-wide">
                  ✓ You've unlocked complimentary shipping
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {items.map((it) => (
                <div key={it.id} className="flex gap-4">
                  <Link
                    to={`/product/${it.slug}`}
                    onClick={onClose}
                    className="w-24 h-28 bg-sand/60 shrink-0 overflow-hidden"
                  >
                    <img src={it.images[0]} alt={it.name} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between gap-2">
                      <div>
                        <div className="text-[10px] tracking-[0.2em] uppercase text-stone mb-1">
                          {it.subcategory}
                        </div>
                        <Link
                          to={`/product/${it.slug}`}
                          onClick={onClose}
                          className="text-sm font-medium leading-snug hover:text-clay"
                        >
                          {it.name}
                        </Link>
                      </div>
                      <button
                        onClick={() => removeFromCart(it.id)}
                        className="text-stone hover:text-ink self-start"
                      >
                        <Icon.Trash size={16} />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center border border-ink/15">
                        <button
                          onClick={() => updateQty(it.id, it.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-sand/60"
                        >
                          <Icon.Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm">{it.quantity}</span>
                        <button
                          onClick={() => updateQty(it.id, it.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-sand/60"
                        >
                          <Icon.Plus size={12} />
                        </button>
                      </div>
                      <div className="text-sm font-medium">${(it.price * it.quantity).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-ink/10 p-6 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone">Subtotal</span>
                  <span>${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone">Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
              </div>
              <Link
                to="/checkout"
                onClick={onClose}
                className="block w-full bg-ink text-bone text-center py-4 text-xs tracking-[0.25em] uppercase hover:bg-clay transition-colors btn-press"
              >
                Checkout — ${(cartSubtotal + shipping).toFixed(2)}
              </Link>
              <button
                onClick={onClose}
                className="block w-full text-center text-xs tracking-[0.15em] uppercase text-stone hover:text-ink py-2 link-underline"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
