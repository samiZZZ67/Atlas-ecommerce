# ATLAS Backend

Production-ready REST API for the ATLAS e-commerce storefront.

## Stack
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: Neon PostgreSQL via Prisma ORM
- **Auth**: JWT (access + refresh tokens) + bcrypt
- **Storage**: Cloudinary (no local files in production)
- **Security**: Helmet, CORS, Rate Limiting, Input Validation

---

## Quick Start

### 1. Clone & install
```bash
cd backend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Fill in all values in .env
```

### 3. Generate Prisma client & migrate
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Seed the database
```bash
npm run seed
```

### 5. Start dev server
```bash
npm run dev
# API running at http://localhost:3000
```

---

## Scripts
| Command | Description |
|---------|-------------|
| `npm run dev` | Development server with hot-reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Start production server |
| `npm run seed` | Populate database with initial data |
| `npx prisma migrate deploy` | Run migrations in production |

---

## API Endpoints

### Auth `/api/auth`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | Public | Register |
| POST | `/login` | Public | Login |
| POST | `/logout` | Protected | Logout |
| POST | `/refresh` | Public | Refresh token |
| POST | `/forgot` | Public | Send reset email |
| POST | `/reset` | Public | Reset password |
| GET | `/me` | Protected | Current user |

### Products `/api/products`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | Public | List (filter/search/sort/paginate) |
| GET | `/:slug` | Public | Single product |
| POST | `/` | Admin | Create |
| PUT | `/:id` | Admin | Update |
| DELETE | `/:id` | Admin | Delete |

### Categories `/api/categories`
| GET | `/` | Public | List all categories |

### Cart `/api/cart` (all protected)
| GET / POST / PUT /:productId / DELETE /:productId / DELETE /clear |

### Wishlist `/api/wishlist` (all protected)
| GET / POST /:productId |

### Orders `/api/orders` (all protected)
| GET / POST / PUT /:id/status (admin) |

### Upload `/api/upload` (admin)
| POST `/` | Upload file to Cloudinary |
| DELETE `/` | Delete file from Cloudinary |

### Health
| GET | `/api/health` | — | Server status check |

---

## Response Format
```json
{ "success": true, "message": "...", "data": {} }
{ "success": false, "message": "...", "errors": [] }
```

---

## Default Admin Credentials
- **Email**: admin@atlas.com
- **Password**: admin123

---

## Deployment (Render / Railway / Fly.io)
1. Set all environment variables from `.env.example` in the host dashboard.
2. Set `NODE_ENV=production`.
3. Build command: `npm run build && npx prisma generate && npx prisma migrate deploy`
4. Start command: `npm start`

---

## Frontend Integration
Add this to your frontend `.env.local`:
```
VITE_API_URL=http://localhost:3000/api
```
