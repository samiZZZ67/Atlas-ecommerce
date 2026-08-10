import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore, type Address, type Order } from "../context/StoreContext";
import { Icon } from "../components/Icons";

type Step = 1 | 2 | 3;

export default function Checkout() {
  const { cart, products, cartSubtotal, placeOrder } = useStore();
  const nav = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [placed, setPlaced] = useState<Order | null>(null);

  const [address, setAddress] = useState<Address>({
    fullName: "",
    line1: "",
    line2: "",
    city: "",
    region: "",
    postal: "",
    country: "United States",
  });
  const [shipping, setShipping] = useState<"standard" | "express">("standard");
  const [card, setCard] = useState({ number: "", name: "", exp: "", cvc: "" });
  const [err, setErr] = useState("");

  const items = cart
    .map((ci) => {
      const p = products.find((x) => x.id === ci.productId);
      return p ? { ...p, quantity: ci.quantity } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const shippingCost =
    cartSubtotal === 0 ? 0 : shipping === "express" ? 32 : cartSubtotal > 200 ? 0 : 18;
  const tax = +(cartSubtotal * 0.08).toFixed(2);
  const total = +(cartSubtotal + shippingCost + tax).toFixed(2);

  if (cart.length === 0 && !placed) {
    return (
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-24 text-center">
        <div className="font-display text-4xl mb-3">Your bag is empty</div>
        <p className="text-stone mb-6">Add some materials before checking out.</p>
        <Link to="/shop" className="inline-block bg-ink text-bone px-8 py-3 text-xs tracking-[0.25em] uppercase">
          Continue shopping
        </Link>
      </div>
    );
  }

  if (placed) {
    return (
      <div className="max-w-2xl mx-auto px-5 md:px-10 py-24 text-center animate-fadeInUp">
        <div className="w-20 h-20 bg-clay text-bone rounded-full flex items-center justify-center mx-auto mb-8">
          <Icon.Check size={36} />
        </div>
        <h1 className="font-display text-4xl md:text-5xl mb-4">Thank you, {placed.shippingAddress.fullName.split(" ")[0]}.</h1>
        <p className="text-stone mb-8">
          Your order <strong className="text-ink">{placed.id}</strong> has been confirmed.
          You'll receive a confirmation email shortly with tracking details.
        </p>
        <div className="bg-sand/40 p-6 mb-8 text-left">
          <div className="text-xs tracking-[0.2em] uppercase text-stone mb-3">Order summary</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>${placed.subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{placed.shipping === 0 ? "Free" : `$${placed.shipping.toFixed(2)}`}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>${placed.tax.toFixed(2)}</span></div>
            <div className="flex justify-between font-medium pt-2 border-t border-ink/10 mt-2"><span>Total</span><span>${placed.total.toFixed(2)}</span></div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => nav("/account")}
            className="bg-ink text-bone px-8 py-3 text-xs tracking-[0.25em] uppercase btn-press"
          >
            View order
          </button>
          <button
            onClick={() => nav("/shop")}
            className="border border-ink/20 px-8 py-3 text-xs tracking-[0.25em] uppercase hover:bg-ink hover:text-bone transition-colors"
          >
            Continue shopping
          </button>
        </div>
      </div>
    );
  }

  const next = () => {
    setErr("");
    if (step === 1) {
      if (!address.fullName || !address.line1 || !address.city || !address.postal) {
        setErr("Please fill in all required shipping fields.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      if (card.number.replace(/\s/g, "").length < 12 || !card.exp || !card.cvc) {
        setErr("Please enter valid payment details.");
        return;
      }
      const last4 = card.number.replace(/\s/g, "").slice(-4) || "0000";
      const order = placeOrder(address, last4);
      setPlaced(order);
    }
  };

  const formatCardNumber = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExp = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d;
  };

  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-12 md:py-16">
      <div className="text-xs text-stone mb-4">
        <Link to="/" className="hover:text-ink">Home</Link> / <Link to="/shop" className="hover:text-ink">Shop</Link> / <span className="text-ink">Checkout</span>
      </div>
      <h1 className="font-display text-4xl md:text-5xl mb-10">Checkout</h1>

      <div className="grid lg:grid-cols-[1fr_420px] gap-10 lg:gap-16">
        <div>
          {/* Steps */}
          <div className="flex items-center gap-3 mb-10 text-xs tracking-[0.2em] uppercase">
            {[
              [1, "Shipping"],
              [2, "Method"],
              [3, "Payment"],
            ].map(([n, label]) => (
              <div key={n as number} className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= (n as number) ? "bg-ink text-bone" : "bg-sand text-stone"
                  }`}
                >
                  {step > (n as number) ? <Icon.Check size={14} /> : n}
                </div>
                <span className={step === n ? "text-ink" : "text-stone"}>{label}</span>
                {n !== 3 && <span className="text-stone">—</span>}
              </div>
            ))}
          </div>

          {err && (
            <div className="bg-clay/10 border border-clay/30 text-clay px-4 py-3 text-sm mb-6">
              {err}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <h2 className="font-display text-2xl mb-4">Shipping address</h2>
              <Field label="Full name" value={address.fullName} onChange={(v) => setAddress({ ...address, fullName: v })} required />
              <Field label="Address line 1" value={address.line1} onChange={(v) => setAddress({ ...address, line1: v })} required />
              <Field label="Address line 2 (optional)" value={address.line2 || ""} onChange={(v) => setAddress({ ...address, line2: v })} />
              <div className="grid grid-cols-2 gap-4">
                <Field label="City" value={address.city} onChange={(v) => setAddress({ ...address, city: v })} required />
                <Field label="Region / State" value={address.region} onChange={(v) => setAddress({ ...address, region: v })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Postal code" value={address.postal} onChange={(v) => setAddress({ ...address, postal: v })} required />
                <div>
                  <label className="block text-xs tracking-[0.15em] uppercase text-stone mb-2">Country</label>
                  <select
                    value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                    className="w-full border border-ink/15 bg-transparent px-4 py-3.5 text-sm focus:border-ink outline-none"
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>Germany</option>
                    <option>France</option>
                    <option>Italy</option>
                    <option>Japan</option>
                    <option>Australia</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3 animate-fadeIn">
              <h2 className="font-display text-2xl mb-4">Shipping method</h2>
              <ShipOption
                active={shipping === "standard"}
                onClick={() => setShipping("standard")}
                title="Standard Shipping"
                time="3–7 business days"
                price={cartSubtotal > 200 ? "Free" : "$18"}
              />
              <ShipOption
                active={shipping === "express"}
                onClick={() => setShipping("express")}
                title="Express Shipping"
                time="1–2 business days"
                price="$32"
              />
              <div className="text-xs text-stone mt-6 p-4 bg-sand/40 border border-ink/10">
                Shipping to: {address.line1}, {address.city}, {address.postal}, {address.country}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <h2 className="font-display text-2xl mb-4">Payment</h2>
              <div className="text-xs text-stone mb-2 p-3 bg-sand/40 border border-ink/10 flex items-center gap-2">
                <Icon.Shield size={14} className="text-clay" />
                This is a demo checkout. No real payment is processed.
              </div>
              <div>
                <label className="block text-xs tracking-[0.15em] uppercase text-stone mb-2">Card number</label>
                <input
                  value={card.number}
                  onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                  placeholder="4242 4242 4242 4242"
                  className="w-full border border-ink/15 bg-transparent px-4 py-3.5 text-sm focus:border-ink outline-none tracking-wider"
                />
              </div>
              <Field label="Name on card" value={card.name} onChange={(v) => setCard({ ...card, name: v })} />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs tracking-[0.15em] uppercase text-stone mb-2">Expiry</label>
                  <input
                    value={card.exp}
                    onChange={(e) => setCard({ ...card, exp: formatExp(e.target.value) })}
                    placeholder="MM / YY"
                    className="w-full border border-ink/15 bg-transparent px-4 py-3.5 text-sm focus:border-ink outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-[0.15em] uppercase text-stone mb-2">CVC</label>
                  <input
                    value={card.cvc}
                    onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                    placeholder="123"
                    className="w-full border border-ink/15 bg-transparent px-4 py-3.5 text-sm focus:border-ink outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-10 pt-6 border-t border-ink/10">
            {step > 1 ? (
              <button
                onClick={() => setStep((step - 1) as Step)}
                className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase hover:text-clay"
              >
                <Icon.ArrowLeft size={14} /> Back
              </button>
            ) : (
              <Link to="/shop" className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase hover:text-clay">
                <Icon.ArrowLeft size={14} /> Return to shop
              </Link>
            )}
            <button
              onClick={next}
              className="bg-ink text-bone px-10 py-4 text-xs tracking-[0.25em] uppercase hover:bg-clay transition-colors btn-press"
            >
              {step === 3 ? `Place order · $${total.toFixed(2)}` : "Continue"}
            </button>
          </div>
        </div>

        {/* Order summary */}
        <aside className="bg-sand/40 p-6 md:p-8 self-start lg:sticky lg:top-28">
          <div className="text-xs tracking-[0.2em] uppercase mb-5">Order summary</div>
          <div className="space-y-4 mb-6 max-h-80 overflow-auto">
            {items.map((it) => (
              <div key={it.id} className="flex gap-3">
                <div className="relative w-16 h-20 bg-bone shrink-0">
                  <img src={it.images[0]} alt="" className="w-full h-full object-cover" />
                  <span className="absolute -top-2 -right-2 bg-ink text-bone text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                    {it.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-stone">{it.subcategory}</div>
                  <div className="text-sm font-medium leading-snug truncate">{it.name}</div>
                  <div className="text-sm mt-1">${(it.price * it.quantity).toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-sm pt-4 border-t border-ink/10">
            <div className="flex justify-between"><span className="text-stone">Subtotal</span><span>${cartSubtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-stone">Shipping</span><span>{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span></div>
            <div className="flex justify-between"><span className="text-stone">Tax</span><span>${tax.toFixed(2)}</span></div>
            <div className="flex justify-between text-base font-medium pt-3 border-t border-ink/10 mt-3">
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs tracking-[0.15em] uppercase text-stone mb-2">
        {label} {required && <span className="text-clay">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full border border-ink/15 bg-transparent px-4 py-3.5 text-sm focus:border-ink outline-none"
      />
    </div>
  );
}

function ShipOption({
  active,
  onClick,
  title,
  time,
  price,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  time: string;
  price: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-5 border-2 text-left transition-colors ${
        active ? "border-ink bg-bone" : "border-ink/15 hover:border-ink/40"
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            active ? "border-ink" : "border-ink/30"
          }`}
        >
          {active && <div className="w-2.5 h-2.5 rounded-full bg-ink" />}
        </div>
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-xs text-stone mt-0.5">{time}</div>
        </div>
      </div>
      <div className="font-medium">{price}</div>
    </button>
  );
}
