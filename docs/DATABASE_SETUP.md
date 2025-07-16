# Database Setup Guide

## Setting up Supabase Database (Free)

### Step 1: Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up (free account)

### Step 2: Create New Project
1. Click "New Project"
2. Name: `pharmacy-app`
3. Create strong password
4. Select region
5. Click "Create new project"

### Step 3: Get Credentials
1. Go to Settings → API
2. Copy:
   - Project URL
   - Anon public key

### Step 4: Configure Environment
1. Create `.env.local` file in project root
2. Add your credentials:
```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Step 5: Run Database Migration
1. Go to Supabase Dashboard
2. Click "SQL Editor"
3. Copy content from `supabase/migrations/20250715151356_square_shore.sql`
4. Paste and click "Run"

### Step 6: Verify Setup
1. Check "Table Editor" in Supabase
2. You should see tables: categories, medicines, cart_items, orders, order_items
3. Sample data should be populated

## Troubleshooting

**Error: "Invalid API key"**
- Double-check your environment variables
- Ensure no extra spaces in .env.local

**Error: "Table doesn't exist"**
- Run the SQL migration script
- Check Table Editor for created tables

**Authentication not working**
- Verify Supabase URL is correct
- Check browser console for errors

## Free Tier Limits
- 500MB database storage
- 2GB bandwidth/month
- 50,000 monthly active users
- No credit card required!