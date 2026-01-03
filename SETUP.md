# 🚀 Make Marble LIVE in 10 Minutes

Follow these steps to deploy your fully functional app.

---

## Step 1: Create Supabase Database (2 min)

1. Go to **[supabase.com](https://supabase.com)** and click "Start your project"
2. Sign in with GitHub
3. Click **"New Project"**
   - Name: `marble`
   - Password: Generate a strong one (save it!)
   - Region: Pick closest to you
4. Wait ~2 minutes for project to be created

---

## Step 2: Set Up Database Tables (1 min)

1. In your Supabase project, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy the ENTIRE contents of `supabase-schema.sql` from this project
4. Paste it into the SQL editor
5. Click **"Run"** (or Cmd+Enter)
6. You should see: `Database schema created successfully!`

---

## Step 3: Get Your API Keys (1 min)

1. In Supabase, go to **Settings** → **API** (left sidebar)
2. Copy these two values:
   - **Project URL** (looks like `https://abc123.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

---

## Step 4: Create Environment File (1 min)

Create a file called `.env.local` in your project root:

```bash
# In terminal:
touch .env.local
```

Add your keys:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## Step 5: Test Locally (1 min)

```bash
npm run dev
```

Go to http://localhost:3000 and try:
1. Enter your email in the waitlist form
2. Check Supabase → Table Editor → waitlist
3. Your email should be there! 🎉

---

## Step 6: Deploy to Vercel (3 min)

### Option A: One-Click Deploy

```bash
npx vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? `marble` (or whatever you want)
- Directory? `./` (just press Enter)
- Override settings? **N**

### Option B: Deploy via GitHub

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/marble.git
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repo
5. It will auto-deploy!

---

## Step 7: Add Environment Variables to Vercel (1 min)

1. Go to your project on [vercel.com](https://vercel.com/dashboard)
2. Click **Settings** → **Environment Variables**
3. Add both variables:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon key |

4. Click **Redeploy** (Deployments tab → ... → Redeploy)

---

## ✅ You're LIVE!

Your app is now at: `https://your-project.vercel.app`

### What's Working:
- ✅ Landing page with email capture
- ✅ Emails saved permanently to Supabase
- ✅ Full canvas app
- ✅ Dashboard with canvas management
- ✅ Export/import functionality

---

## 📊 View Your Signups

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Click **Table Editor** → **waitlist**
3. See all your email signups!

---

## 🔮 Next Steps

### Add a Custom Domain
1. Buy a domain (Namecheap, Google Domains, etc.)
2. In Vercel: Settings → Domains → Add
3. Update your DNS as instructed

### Add Analytics
```bash
npm install @vercel/analytics
```

### Add Email Notifications
Sign up for [Resend](https://resend.com) to send welcome emails when someone joins the waitlist.

---

## Need Help?

- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Docs](https://nextjs.org/docs)

---

**LFG! 🚀 You're about to be rich.**

