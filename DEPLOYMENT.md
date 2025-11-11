# Deployment Guide - Ohio Risk Tool Dashboard

This guide will help you deploy both the frontend and backend to the cloud for permanent access.

## Architecture

- **Frontend**: React + Vite app deployed on Vercel
- **Backend**: Node.js + Express API deployed on Railway
- **Database**: Azure PostgreSQL (already set up)

## Step 1: Deploy Backend to Railway

### 1.1 Install Railway CLI (if not already installed)

```bash
npm install -g @railway/cli
```

### 1.2 Login to Railway

```bash
railway login
```

This will open your browser for authentication.

### 1.3 Deploy the Backend

```bash
cd ~/Documents/ohiorisktool/server
railway init
```

Select "Create new project" and give it a name like "ohio-risk-backend"

### 1.4 Add Environment Variables

You need to add your PostgreSQL credentials to Railway:

```bash
railway variables set DB_HOST=vibe-coding.postgres.database.azure.com
railway variables set DB_PORT=5432
railway variables set DB_NAME=atlantis
railway variables set DB_USER=atlantisreadonly
railway variables set DB_PASSWORD=hy2micr7scaVGUvtoorEqmsLfN
railway variables set DB_SSL=true
```

### 1.5 Deploy

```bash
railway up
```

### 1.6 Get Your Backend URL

```bash
railway open
```

This will open the Railway dashboard. Click on your service, then go to "Settings" > "Networking" and you'll see your public URL (something like `https://ohio-risk-backend-production.up.railway.app`)

**Copy this URL - you'll need it for the frontend!**

---

## Step 2: Deploy Frontend to Vercel

### 2.1 Update Environment Variables

Create a new file: `.env.production` in the root of the project:

```bash
cd ~/Documents/ohiorisktool
```

Create `.env.production` with:

```
VITE_API_URL=https://your-railway-backend-url.up.railway.app
```

Replace `your-railway-backend-url` with the URL you got from Railway in Step 1.6

### 2.2 Install Vercel CLI (if not already installed)

```bash
npm install -g vercel
```

### 2.3 Login to Vercel

```bash
npx vercel login
```

### 2.4 Deploy to Vercel

```bash
npx vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Choose your account
- Link to existing project? **N**
- Project name? **ohio-risk-tool** (or your preferred name)
- Directory? Just press Enter (use current directory)
- Override settings? **N**

### 2.5 Deploy to Production

After the initial deploy, run:

```bash
npx vercel --prod
```

### 2.6 Get Your Frontend URL

Vercel will give you a URL like: `https://ohio-risk-tool.vercel.app`

---

## Step 3: Update CORS Settings

Now that you have your frontend URL, update the backend CORS settings:

1. Go to Railway dashboard
2. Select your backend service
3. Go to "Variables"
4. Add a new variable:
   - `ALLOWED_ORIGINS=https://your-vercel-url.vercel.app`

Or update `server/index.js` to allow your Vercel domain:

```javascript
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || '*'
}));
```

---

## Step 4: Test Your Deployment

Visit your Vercel URL: `https://your-app.vercel.app`

You should see:
- ✅ Dashboard loads
- ✅ Left sidebar shows "Connected" status
- ✅ Real data from PostgreSQL database
- ✅ All tables showing row counts

---

## Sharing with Colleagues

Simply share your Vercel URL:
```
https://your-app.vercel.app
```

Anyone with this link can access the dashboard from anywhere in the world!

---

## Troubleshooting

### Backend not connecting to database
- Check Railway environment variables are set correctly
- Verify PostgreSQL allows connections from Railway's IPs
- Check Railway logs: `railway logs`

### Frontend not connecting to backend
- Verify `VITE_API_URL` is set correctly in Vercel
- Check CORS settings on backend
- Open browser console (F12) to see any errors

### Need to redeploy
- Backend: `cd server && railway up`
- Frontend: `cd .. && npx vercel --prod`

---

## Estimated Time: 10-15 minutes

The deployment should take about 10-15 minutes total if you follow the steps carefully.
