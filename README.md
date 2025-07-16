# Pharmacy E-commerce Website

A modern pharmacy e-commerce platform built with React, TypeScript, and Supabase.

## Features

- 🏥 Complete pharmacy product catalog
- 🔐 User authentication (register/login)
- 🛒 Shopping cart functionality
- 📦 Order management system
- 💊 Medicine categories and detailed information
- 📱 Responsive design for all devices
- 🔒 Secure database with Row Level Security

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Build Tool**: Vite

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Set up Supabase Database

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and anon key from Settings → API

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env.local`
2. Fill in your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Set up Database Schema

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and run the SQL from `supabase/migrations/20250715151356_square_shore.sql`

### 5. Run the Application

```bash
npm run dev
```

## Database Schema

The application uses the following tables:

- **categories**: Medicine categories (Pain Relief, Antibiotics, etc.)
- **medicines**: Product information with pricing and details
- **cart_items**: User shopping cart items
- **orders**: Customer orders with delivery information
- **order_items**: Individual items within each order

## Authentication Flow

1. Users can browse products without authentication
2. Adding items to cart requires login/registration
3. Users can register with email and password
4. Cart items persist across sessions
5. Orders are tied to authenticated users

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Free Tier Limits (Supabase)

- 500MB database storage
- 2GB bandwidth per month
- 50,000 monthly active users
- Perfect for learning and small projects!

## Support

This is a learning project. Feel free to modify and experiment!