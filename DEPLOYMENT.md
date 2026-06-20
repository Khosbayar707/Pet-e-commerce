# MyCat Deployment Guide

## Prerequisites

- PostgreSQL database (local or cloud like Neon, Supabase, PlanetScale)
- Cloudinary account (free tier works)
- Google OAuth credentials (optional)
- Node.js 18+

## 1. Environment Setup

Copy `.env.local` and fill in real values:

```env
# PostgreSQL connection string
DATABASE_URL="postgresql://user:password@host:5432/mycat?schema=public"

# Auth.js secret — generate with: openssl rand -base64 32
AUTH_SECRET="your-generated-secret"

# Google OAuth (optional — visit console.cloud.google.com)
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
AUTH_URL="https://your-domain.com"

# Cloudinary (visit cloudinary.com)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"

# App URL
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

## 2. Database Setup

```bash
# Push schema to database
npm run db:push

# OR create migrations (recommended for production)
npm run db:migrate

# Seed with sample data
npm run db:seed
```

## 3. First Admin User

After seeding, sign in with:
- **Admin**: admin@mycat.store / admin123
- **Customer**: customer@test.com / customer123

To make any user an admin, run in Prisma Studio (`npm run db:studio`):
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your@email.com';
```

## 4. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# Project → Settings → Environment Variables
```

Or connect your GitHub repo to Vercel for automatic deployments.

## 5. Local Development

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run db:studio    # Open Prisma Studio (database GUI)
```

## Key URLs

| URL | Description |
|-----|-------------|
| `/` | Homepage |
| `/products` | Product catalog |
| `/admin` | Admin dashboard (requires ADMIN role) |
| `/login` | Customer login |
| `/register` | Customer registration |

## Architecture

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL + Prisma v7 + PrismaPg adapter
- **Auth**: Auth.js v5 (NextAuth beta) with credentials + Google OAuth
- **Images**: Cloudinary
- **UI**: Custom components built on Radix UI primitives + Tailwind CSS v4
- **Forms**: React Hook Form + Zod v4
- **Notifications**: Sonner toasts
