# 🚀 Quick Deploy Guide - Get Your Dashboard Online in 10 Minutes!

Follow these steps exactly to deploy your dashboard to the cloud.

---

## ⚡ STEP 1: Deploy Backend to Railway (5 minutes)

### 1.1 Go to Railway
1. Open your browser and go to: **https://railway.app/**
2. Click **"Start a New Project"** (sign up with GitHub if needed)
3. Click **"Deploy from GitHub repo"** → Select **"Deploy without GitHub"** → **"Empty Project"**

### 1.2 Add Backend Service
1. Click **"+ New"** → **"Empty Service"**
2. Click on the new service
3. Go to **"Settings"** tab
4. Under "Source Code", click **"Connect GitHub"** or use **"Local Development"**

**OR EASIER: Upload Files**
1. Click **"+ New"** → **"GitHub Repo"**
2. Or use Railway CLI (see below)

### 1.3 Upload Your Backend Files

**Option A: Using Railway Dashboard**
1. In Railway, click your service
2. Go to "Settings" → "Source" → "Upload files"
3. Upload these files from `~/Documents/ohiorisktool/server/`:
   - `index.js`
   - `db.js`
   - `package.json`

**Option B: Using GitHub (Recommended)**
1. Push your code to GitHub first
2. Connect Railway to your GitHub repo
3. Railway will auto-deploy

**Option C: Using Railway CLI**
```bash
# Install Railway CLI
brew install railway

# Login
railway login

# Navigate to backend folder
cd ~/Documents/ohiorisktool/server

# Initialize and deploy
railway init
railway up
```

### 1.4 Set Environment Variables in Railway

In Railway dashboard:
1. Click your service
2. Go to **"Variables"** tab
3. Click **"+ New Variable"** and add each of these:

```
DB_HOST=vibe-coding.postgres.database.azure.com
DB_PORT=5432
DB_NAME=atlantis
DB_USER=atlantisreadonly
DB_PASSWORD=hy2micr7scaVGUvtoorEqmsLfN
DB_SSL=true
```

### 1.5 Generate Public URL

1. Go to **"Settings"** tab
2. Scroll to **"Networking"**
3. Click **"Generate Domain"**
4. **COPY THE URL** - it will look like:
   ```
   https://ohio-risk-backend-production-abc123.up.railway.app
   ```

✅ **Backend is now deployed!** Test it by visiting:
```
https://your-backend-url.up.railway.app/api/health
```

You should see: `{"status":"ok","message":"API server is running"}`

---

## ⚡ STEP 2: Deploy Frontend to Vercel (3 minutes)

### 2.1 Update Frontend Environment Variable

1. Create file: `.env.production` in your project root:
```bash
cd ~/Documents/ohiorisktool
nano .env.production
```

2. Add this line (replace with YOUR Railway URL from Step 1.5):
```
VITE_API_URL=https://your-backend-url.up.railway.app
```

Save and exit (Ctrl+X, Y, Enter)

### 2.2 Deploy to Vercel

**Option A: Using Vercel Dashboard (Easiest)**
1. Go to: **https://vercel.com/**
2. Sign in with GitHub
3. Click **"Add New"** → **"Project"**
4. Import your GitHub repo or upload files
5. Vercel will auto-detect Vite and deploy!

**Option B: Using Vercel CLI**
```bash
# Login to Vercel
npx vercel login

# Deploy to production
npx vercel --prod
```

Follow the prompts and Vercel will give you a URL like:
```
https://ohio-risk-tool.vercel.app
```

✅ **Frontend is now deployed!**

---

## ⚡ STEP 3: Update Backend CORS (1 minute)

Go back to Railway:
1. Click your backend service
2. Go to **"Variables"** tab
3. Add one more variable:

```
ALLOWED_ORIGIN=https://your-vercel-url.vercel.app
```

(Replace with your actual Vercel URL from Step 2.2)

Then redeploy: Click **"Deploy"** button in Railway

---

## 🎉 DONE! Share Your Dashboard

Your dashboard is now live at:
```
https://your-vercel-url.vercel.app
```

Share this URL with anyone - they can access it from anywhere in the world!

---

## 📱 What Your Colleague Will See

When they visit the URL, they'll see:
- ✅ Full dashboard with all components
- ✅ Live database connection indicator
- ✅ Real data from your PostgreSQL database
- ✅ Interactive charts and tables
- ✅ Collapsible sidebar

---

## 🔧 Quick Troubleshooting

**Frontend shows "disconnected"**
- Make sure `VITE_API_URL` in `.env.production` is correct
- Make sure you redeployed frontend after adding the variable

**Backend not working**
- Check Railway logs: Click service → "Deployments" → Latest deploy → "View Logs"
- Verify all environment variables are set

**CORS errors**
- Make sure `ALLOWED_ORIGIN` in Railway matches your Vercel URL exactly
- Redeploy backend after adding CORS variable

---

## Need Help?

If you get stuck, check:
- Railway logs for backend errors
- Browser console (F12) for frontend errors
- Verify database credentials are correct in Railway

Deployment time: **~10 minutes total** ⚡
