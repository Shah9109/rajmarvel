# Deployment Guide

## 1. Environment Variables Setup

Before deploying, ensure you have the following environment variables ready.

### Backend `.env`
```env
PORT=5001
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.nduf7ic.mongodb.net/?appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=production

# Cloudinary (For File Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay (For Automated Payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email (Nodemailer for Notifications)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Frontend `.env`
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

---

## 2. Deploying Backend (Render / Railway)

1. Push your code to a GitHub repository.
2. Go to **Render.com** (or Railway).
3. Create a new **Web Service**.
4. Connect your GitHub repository.
5. Set the **Build Command** to `npm install`.
6. Set the **Start Command** to `npm start`.
7. Add all the Environment Variables from your Backend `.env`.
8. Click **Deploy**.

---

## 3. Deploying Frontend (Vercel / Netlify)

1. Go to **Vercel.com** (or Netlify).
2. Create a **New Project**.
3. Import your GitHub repository.
4. Set the **Framework Preset** to `Vite`.
5. Ensure the **Root Directory** is set to `frontend`.
6. Add the `VITE_API_URL` environment variable pointing to your deployed backend.
7. Click **Deploy**.

---

## 4. Testing Steps

1. **User Flow**:
   - Register a new user.
   - Go to the Dashboard and "Request a Project".
   - Check the email inbox (if SMTP configured) for the booking confirmation.
   - Once Admin approves the project (status: in_progress), test the "Pay Now" feature.
   - Try a manual payment (UPI/Bank Transfer) and upload a mock screenshot.
   - Try the Razorpay flow.

2. **Admin Flow**:
   - Login as Admin.
   - Go to the Admin Dashboard -> Projects tab.
   - Accept the user's booking (change status from pending to planning/in_progress).
   - Go to Payments tab. View the uploaded screenshot for the manual payment.
   - Click the green checkmark to confirm the payment.
   - Verify the user receives a confirmation email.
   - Go to Projects tab, click "Bill", add materials/cost, and generate the bill.

3. **PDF Generation**:
   - As a User, go to your dashboard, scroll down to "Bills & Invoices".
   - Click "Download PDF" to verify `pdfkit` generates the invoice dynamically.
