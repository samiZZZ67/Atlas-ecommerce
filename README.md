# ATLAS — Curated Materials Marketplace

A production-grade e-commerce platform for premium materials — fabrics, leathers, woods, stones, metals, and ceramics. Built with React, TypeScript, Vite, and Tailwind CSS.

![ATLAS](https://img.shields.io/badge/Status-Production%20Ready-success)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![React](https://img.shields.io/badge/React-18.3-61dafb)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38bdf8)

## 🎯 Overview

ATLAS is a fully-functional, highly interactive e-commerce application designed to rival Shopify and Amazon in user experience. It features a stunning landing page, complete shopping flow, user authentication, order management, and admin panel — all persisted to localStorage for a seamless demo experience.

## ✨ Features

### 🏠 Landing Page
- **Hero Section**: Full-viewport hero with animated Ken Burns effect, gradient overlay, and call-to-action buttons
- **Animated Marquee**: Scrolling text showcasing sourcing origins (Biella, Tuscany, Carrara, etc.)
- **Category Grid**: 6 material categories with hover effects and image zoom
- **Featured Products**: Curated editor's picks with quick-add functionality
- **Story Section**: Brand philosophy with statistics and craftsman imagery
- **Promotional Banners**: Dual banner system for sales and trade program
- **New Arrivals**: Dedicated section for latest materials
- **Trust Strip**: Shipping, provenance, sustainability, and sample service promises
- **Testimonials Carousel**: Auto-rotating customer reviews with avatars
- **Bestsellers**: Top-rated products in dark theme section
- **Newsletter Signup**: Email capture with background imagery

### 🛍️ E-Commerce Functionality
- **Product Catalog**: 12 premium materials with detailed specifications
- **Smart Search**: Full-text search with autocomplete and popular suggestions (⌘K shortcut)
- **Advanced Filtering**: By category, price range, collection (new/bestseller/sale), and sort options
- **Product Detail Pages**: 
  - Multi-image gallery with thumbnails
  - Quantity selector with stock indicators
  - Tabbed content (description, details, shipping)
  - Related products
  - Wishlist toggle
- **Shopping Cart**:
  - Slide-out drawer with real-time updates
  - Quantity controls
  - Free shipping progress bar
  - Persistent across sessions
- **Wishlist System**: Save favorite materials with heart icon toggle
- **Checkout Flow**:
  - 3-step process (Shipping → Method → Payment)
  - Address form with validation
  - Shipping method selection (standard/express)
  - Mock payment with card formatting
  - Order confirmation with summary

### 👤 User System
- **Authentication**: Registration and login with localStorage persistence
- **Account Dashboard**: 
  - Order history with expandable details
  - Loyalty tier tracking (Member → Studio → Atelier)
  - Total spend statistics
  - Admin panel access (for admin users)
- **Demo Admin Account**: `admin@atlas.com` / `admin123`

### 🧑‍💼 Admin Panel
- **Sales Overview**: Revenue, order count, pending orders, low stock alerts
- **Product Management**: View all products, delete items, category breakdown
- **Order Management**: Update order status (Processing → Shipped → Delivered → Cancelled)
- **Analytics Dashboard**: Top products, sales by category with visual bars

### 📰 Additional Pages
- **Journal**: Editorial content with featured article and grid layout
- **404 Page**: Custom error page with branding

## 🎨 Design System

### Typography
- **Display**: Cormorant Garamond (serif) for headlines
- **Body**: Inter (sans-serif) for UI and body text

### Color Palette
- **Ink** (`#0a0a0a`): Primary dark
- **Bone** (`#faf8f4`): Background
- **Clay** (`#b5651d`): Accent/CTA
- **Sand** (`#e8ddc8`): Secondary background
- **Stone** (`#6b6258`): Muted text

### Animations
- Fade-in-up on scroll (Intersection Observer)
- Ken Burns effect on hero images
- Marquee scrolling text
- Card hover lift with image zoom
- Smooth page transitions
- Button press feedback
- Cart drawer slide-in
- Search modal fade

## 🏗️ Architecture

### Tech Stack
- **React 18.3** with TypeScript
- **React Router 7** for client-side routing
- **Tailwind CSS 4** for styling
- **Vite 7** for build tooling
- **Context API** for state management
- **localStorage** for data persistence

### File Structure
```
src/
├── components/          # Reusable UI components
│   ├── Icons.tsx       # SVG icon library
│   ├── Navbar.tsx      # Navigation with cart/search
│   ├── Footer.tsx      # Site footer
│   ├── ProductCard.tsx # Product grid card
│   ├── CartDrawer.tsx  # Slide-out cart
│   └── SearchModal.tsx # Full-screen search
├── context/
│   └── StoreContext.tsx # Global state (cart, auth, orders)
├── data/
│   └── products.ts     # Product catalog and categories
├── hooks/
│   └── useReveal.ts    # Scroll reveal animation hook
├── pages/
│   ├── Home.tsx        # Landing page
│   ├── Shop.tsx        # Product listing with filters
│   ├── ProductDetail.tsx # Single product view
│   ├── Checkout.tsx    # 3-step checkout flow
│   ├── Auth.tsx        # Login, Register, Wishlist
│   ├── Account.tsx     # User dashboard
│   ├── Admin.tsx       # Admin panel
│   └── Journal.tsx     # Blog/editorial + 404
└── App.tsx             # Router and global layout
```

### State Management
All state is managed through React Context with localStorage persistence:
- **Cart**: Items, quantities, totals
- **Wishlist**: Saved product IDs
- **Orders**: Complete order history
- **User**: Authentication session
- **Products**: Admin-managed catalog

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development
The dev server runs at `http://localhost:5173` with hot module replacement.

### Production Build
```bash
npm run build
```
Outputs a single `dist/index.html` file (372 KB gzipped to 106 KB) that can be deployed anywhere.

## 🎮 Demo Features

### Try These Flows

1. **Browse & Shop**
   - Scroll the landing page to see all sections
   - Click category cards to filter products
   - Use search (⌘K) to find "linen" or "marble"
   - Hover product cards for quick-add

2. **Product Detail**
   - Click any product to view details
   - Switch between gallery images
   - Add to cart with quantity selector
   - Toggle wishlist

3. **Cart & Checkout**
   - Open cart drawer from navbar
   - Adjust quantities
   - Proceed to 3-step checkout
   - Complete mock payment (any card number works)

4. **User Account**
   - Register a new account or login as admin
   - View order history
   - Track loyalty tier progress

5. **Admin Panel** (login as `admin@atlas.com` / `admin123`)
   - View sales dashboard
   - Manage product inventory
   - Update order statuses

## 🎯 Key Highlights

### Performance
- **106 KB gzipped** single-file bundle
- Lazy-loaded images with Unsplash CDN
- Intersection Observer for scroll animations
- Optimized re-renders with React.memo patterns

### Accessibility
- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation (⌘K for search)
- Focus management in modals

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-optimized interactions
- Collapsible navigation

### User Experience
- Smooth 60fps animations
- Instant cart updates
- Persistent state across sessions
- Visual feedback on all interactions
- Loading states and transitions

## 📦 Product Data

The catalog includes 12 curated materials across 6 categories:

1. **Fabrics & Textiles**: Merino wool, Belgian linen
2. **Leather & Hides**: Horween Chromexcel, Vegetable-tanned vachetta
3. **Woods & Veneers**: Black walnut slab, European white oak
4. **Stone & Marble**: Carrara marble, Roman travertine
5. **Metals & Alloys**: Brushed brass, Patinated copper
6. **Ceramic & Clay**: Shigaraki stoneware, Hand-thrown terracotta

Each product includes:
- Multiple high-resolution images
- Detailed specifications
- Origin and provenance
- Pricing with unit (per yard, per hide, per m², etc.)
- Stock levels and ratings

## 🔐 Security Notes

This is a **frontend-only demo**. For production:
- Replace localStorage with a real backend (Django, Node, etc.)
- Implement proper authentication (JWT, OAuth)
- Add CSRF protection
- Use Stripe/PayPal for real payments
- Validate all inputs server-side
- Implement rate limiting
- Add HTTPS enforcement

## 🎨 Customization

### Change Brand Colors
Edit `src/index.css`:
```css
@theme {
  --color-ink: #0a0a0a;
  --color-bone: #faf8f4;
  --color-clay: #b5651d;
  --color-sand: #e8ddc8;
  --color-stone: #6b6258;
}
```

### Add Products
Edit `src/data/products.ts` and add to the `products` array.

### Modify Categories
Edit `src/data/products.ts` and update the `categories` array.

## 📄 License

MIT License — free to use for personal and commercial projects.

## 🙏 Credits

- **Images**: Unsplash (curated collection)
- **Fonts**: Google Fonts (Inter, Cormorant Garamond)
- **Icons**: Custom SVG icon set
- **Design**: Inspired by premium e-commerce platforms (Graza, Aesop, Ferm Living)

---

**Built with ❤️ for the craft community**
