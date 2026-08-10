import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { StoreProvider } from "./context/StoreContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import SearchModal from "./components/SearchModal";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import { Login, Register, Wishlist } from "./pages/Auth";
import Account from "./pages/Account";
import Admin from "./pages/Admin";
import Journal, { NotFound } from "./pages/Journal";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <StoreProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-bone text-ink">
          <Navbar onOpenSearch={() => setSearchOpen(true)} onOpenCart={() => setCartOpen(true)} />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/account" element={<Account />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/trade" element={<Journal />} />
              <Route path="/contact" element={<Journal />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
          <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
        </div>
      </BrowserRouter>
    </StoreProvider>
  );
}
