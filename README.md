# Frontend Deployment on Vercel

## Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

## Step 2: Login to Vercel
```bash
vercel login
```

## Step 3: Deploy
```bash
# From frontend directory
vercel --prod
```

## Step 4: Set Environment Variable
After first deployment, set the production API URL:
```bash
vercel env add REACT_APP_API_URL production
# Enter: https://your-backend-url.onrender.com
```

## Step 5: Redeploy
```bash
vercel --prod
```

## Alternative: Web Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import from GitHub
4. Set build settings:
   - **Framework**: Create React App
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Add environment variable: `REACT_APP_API_URL`
6. Deploy

## Environment Variables
- **Development**: `REACT_APP_API_URL=http://localhost:5000`
- **Production**: `REACT_APP_API_URL=https://your-backend.onrender.com`

## Troubleshooting
- **404 errors**: Check API URL in environment variables
- **CORS errors**: Ensure backend allows your Vercel domain
- **Build fails**: Check package.json scripts

## Free Tier Benefits
- Unlimited static sites
- Custom domains
- HTTPS certificates
- Global CDN
