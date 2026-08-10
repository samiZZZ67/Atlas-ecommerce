# 🚀 Deployment Guide: Render (Backend) & Vercel (Frontend)

This project consists of two completely separate applications:
- **Backend**: Express.js + Prisma ORM + PostgreSQL (Neon) + Cloudinary (ready for **Render**)
- **Frontend**: Vite + React + Tailwind CSS (ready for **Vercel**)

---

## 1. 🗄️ Backend Deployment on Render

### Step 1: Push Project to GitHub
Push your project repository to GitHub.

### Step 2: Set Up Database (Neon PostgreSQL)
1. Go to [Neon.tech](https://neon.tech) and create a PostgreSQL database instance.
2. Copy your connection string (`DATABASE_URL`), e.g.:
   `postgresql://user:password@ep-xyz.neon.tech/atlas?sslmode=require`

### Step 3: Create Render Web Service
1. Log in to [Render.com](https://render.com) and click **New +** -> **Web Service**.
2. Connect your GitHub repository.
3. Set the following settings:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npx prisma migrate deploy && npm run start`

4. Add Environment Variables in Render:
   - `PORT`: `10000` (or leave default provided by Render)
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: *(Your Neon Connection String)*
   - `JWT_SECRET`: *(A long random secret string)*
   - `JWT_REFRESH_SECRET`: *(Another long random secret string)*
   - `CORS_ORIGIN`: `https://your-frontend.vercel.app,http://localhost:5173`
   - `CLOUDINARY_CLOUD_NAME`: *(Your Cloudinary Cloud Name)*
   - `CLOUDINARY_API_KEY`: *(Your Cloudinary API Key)*
   - `CLOUDINARY_API_SECRET`: *(Your Cloudinary API Secret)*

5. Click **Create Web Service**. Once deployed, copy your backend URL:
   `https://atlas-backend.onrender.com`

---

## 2. 🌐 Frontend Deployment on Vercel

### Step 1: Import Project into Vercel
1. Log in to [Vercel.com](https://vercel.com) and click **Add New...** -> **Project**.
2. Select your GitHub repository.

### Step 2: Configure Project Settings
- **Framework Preset**: `Vite`
- **Root Directory**: Select `frontend`

### Step 3: Set Environment Variables
Add the following variable in Vercel:
- `VITE_API_URL`: `https://atlas-backend.onrender.com/api` (Replace with your actual Render backend URL)
- `NEXT_PUBLIC_API_URL`: `https://atlas-backend.onrender.com/api`

### Step 4: Deploy
Click **Deploy**. Vercel will build and publish your frontend.

---

## 🛠️ Verification & Testing
1. Visit your Vercel URL (e.g., `https://your-app.vercel.app`).
2. Test browsing categories & products (served from Neon via Render API).
3. Test user registration and login (`POST /api/auth/register`, `/login`).
4. Test adding to cart, placing an order, and admin product management.
