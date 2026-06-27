# Jonak Premium Build

React/Vite one-page site for Jonak Construction, upgraded with a Node.js + Express API, MongoDB Atlas storage, secure admin authentication, and GridFS-based product media.

## What’s Included

- Public website with the existing visual design preserved
- MongoDB-backed product catalogue
- Hidden admin login at `/admin`
- Protected admin dashboard at `/admin/dashboard`
- JWT auth with httpOnly cookies
- GridFS media storage for images and MP4 video
- Seed script for the first admin user and starter catalogue

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
copy .env.example .env
```

3. Fill in the required values:

- `MONGODB_URI`
- `JWT_SECRET`
- `FRONTEND_URL`
- `BACKEND_URL`

4. Start both frontend and backend:

```bash
npm run dev
```

The frontend runs on Vite and the terminal will print the exact local URL. Open that URL and append `/admin` for the hidden login page.

In this workspace, the admin login is:

- `http://localhost:8082/admin`
- `admin@jonakconstruction.com`
- `Admin123!`

## Seed the First Admin

Set the seed credentials in your shell or `.env`:

- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`
- `SEED_ADMIN_NAME`

Then run:

```bash
npm run seed:admin
```

The seed script creates or updates the first admin user and, when the catalogue is empty, uploads starter media and products into MongoDB/GridFS.

## API Overview

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/products`
- `GET /api/products/:slug`
- `GET /api/media/:id`
- `GET /api/admin/products`
- `POST /api/admin/products`
- `PATCH /api/admin/products/:id`
- `DELETE /api/admin/products/:id`
- `GET /api/admin/media`
- `POST /api/admin/media/upload`
- `DELETE /api/admin/media/:id`

## Notes

- Images and MP4 videos are stored in MongoDB Atlas GridFS.
- The admin dashboard previews local uploads before saving.
- Public products show only published records.
- If frontend and backend are hosted on different origins in production, set `VITE_API_URL` to the backend origin and keep `FRONTEND_URL`/`BACKEND_URL` aligned for CORS and cookies.
