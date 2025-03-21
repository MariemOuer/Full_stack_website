#  Express API - Vercel Deployment Guide

// RUN THE BACKEND 
##  Run Locally
Install dependencies (if needed): npm install
Start the development server: node index.js
Open your browser and visit: http://localhost:3000
Test an API route: curl http://localhost:3000/api/hello

// DO NOT DO THIS PLEASE I HAVE ALREADY SET UP VERCEL!!!!!!
## 🌍 Deploy on Vercel
1️⃣ Install Vercel CLI (if not installed)
npm install -g vercel

2️⃣ Log in to Vercel
vercel login
Follow the prompts to authenticate with your Vercel account.

3️⃣ Deploy for the First Time
vercel --prod
This will generate a live URL like: https://your-project-name.vercel.app

🔄 Set Up Production Environment Variables
Since .env.local won't be used in production, you need to set environment variables inside Vercel. Go to Vercel Dashboard → Your Project → Settings → Environment Variables and add them manually.

// DO NOT DO THIS EITHER PLEASE
## 🔄 Deploy After Updates
Whenever you update your backend, redeploy with:
vercel --prod

⚠️ Note: This will generate a new URL, so you may need to update your frontend environment variables accordingly. Also to prevent CORS issues, you may need to go to vercel and disable vercel authentication under "Deployment Protections", note if this is for real software you MUST do some sort of api auth like json tokens so your app cant be hacked! Look into how you can only allow access from specfic origins and how to protect your APIs!

To test if you have cors issues:
curl -i [api] on your terminal

