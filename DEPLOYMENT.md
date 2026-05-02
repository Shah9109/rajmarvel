# Raj Marvel - Production Deployment Guide

This guide provides step-by-step instructions for deploying the **Raj Marvel Exterior Designs** platform. The project is structured as a Monorepo, meaning both the backend and frontend exist in the same repository. 

We will deploy the **Backend on Render** and the **Frontend on Vercel**.

---

## 🟢 Part 1: Deploying the Backend (Render)

Render is perfect for hosting our Node/Express/MongoDB backend API.

### 1. Create a Web Service
1. Create an account at [Render.com](https://render.com) and click **New+** > **Web Service**.
2. Connect your GitHub account and select the `rajmarvel` repository.

### 2. Configure the Service
Set the following configurations in the Render dashboard:
- **Name**: `rajmarvel-backend` (or anything you prefer)
- **Language**: `Node`
- **Root Directory**: `backend` *(⚠️ VERY IMPORTANT: This tells Render to only look inside the backend folder!)*
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 3. Add Environment Variables
Scroll down to the **Environment Variables** section and click "Add Environment Variable". Add the following:

```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.nduf7ic.mongodb.net/?appName=Cluster0
JWT_SECRET=your_super_secret_random_string

# Cloudinary (Images/PDFs)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay (Payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```
*(Replace the placeholder values with your actual API keys and database links).*

### 4. Deploy!
Click **Create Web Service**. Render will now build and deploy your backend. 
Once it's live, copy the URL they give you (e.g., `https://rajmarvel-backend.onrender.com`). You will need this for the Frontend.

---

## 🔵 Part 2: Deploying the Frontend (Vercel)

Vercel is the absolute best platform for hosting React/Vite web applications.

### 1. Import the Project
1. Create an account at [Vercel.com](https://vercel.com) and click **Add New** > **Project**.
2. Connect your GitHub account and Import the `rajmarvel` repository.

### 2. Configure the Project
Before you click deploy, carefully set these configurations:
- **Project Name**: `raj-marvel-exterior`
- **Framework Preset**: `Vite`
- **Root Directory**: Click "Edit" and select the `frontend` folder! *(⚠️ VERY IMPORTANT!)*

### 3. Add Environment Variables
Open the "Environment Variables" dropdown and add your Backend URL:

- **Name**: `VITE_API_URL`
- **Value**: `https://rajmarvel-backend.onrender.com/api` *(Paste the URL from Render here, and make sure it ends with `/api`!)*

### 4. Deploy!
Click **Deploy**. Vercel will automatically run `npm run build` inside your frontend folder and publish your beautiful website to the internet!

---

## 🛠 Maintenance & Updates

Because this is connected to your GitHub, any time you run these commands on your computer:
```bash
git add .
git commit -m "Updated website text"
git push
```
**Both Vercel and Render will automatically detect the changes and update your live website instantly!** No manual work required.
