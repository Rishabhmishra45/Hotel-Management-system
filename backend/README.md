# 🏨 StaySync – Backend API

StaySync is a **production-ready Hotel & Restaurant Management System backend**
built using **Node.js, Express, MongoDB**, and real-world SaaS practices.

This backend powers:
- Hotel room management
- Restaurant dish management
- User & admin authentication
- Booking & payment workflows
- Admin analytics dashboard
- Email notifications

Frontend and Admin Panel consume these APIs separately.

---

## 🚀 Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication (Access + Refresh Tokens)
- Razorpay & Stripe (Payments)
- Cloudinary (Image Uploads)
- Nodemailer (Emails)
- Helmet, CORS, Morgan

---

## 📁 Backend Folder Structure

backend/
│
├── src/
│ ├── config/
│ │ ├── db.js
│ │ ├── cloudinary.js
│ │ ├── razorpay.js
│ │ └── stripe.js
│ │
│ ├── controllers/
│ │ ├── authController.js
│ │ ├── roomController.js
│ │ ├── dishController.js
│ │ ├── bookingController.js
│ │ ├── paymentController.js
│ │ ├── paymentLinkController.js
│ │ └── analyticsController.js
│ │
│ ├── models/
│ │ ├── User.js
│ │ ├── Room.js
│ │ ├── Dish.js
│ │ ├── Booking.js
│ │ └── Payment.js
│ │
│ ├── routes/
│ │ ├── authRoutes.js
│ │ ├── roomRoutes.js
│ │ ├── dishRoutes.js
│ │ ├── bookingRoutes.js
│ │ ├── paymentRoutes.js
│ │ ├── paymentLinkRoutes.js
│ │ └── analyticsRoutes.js
│ │
│ ├── middleware/
│ │ ├── authMiddleware.js
│ │ └── errorMiddleware.js
│ │
│ ├── utils/
│ │ ├── ApiError.js
│ │ ├── asyncHandler.js
│ │ ├── constants.js
│ │ ├── generateTokens.js
│ │ ├── sendEmail.js
│ │ └── emailTemplates.js
│ │
│ └── server.js
│
├── .env.example
├── package.json
├── .gitignore
└── README.md


---

## 🔐 Authentication

### User
- Register
- Login
- JWT Access Token + Refresh Token
- Password hashing using bcrypt

### Admin
- Fixed admin credentials (stored in `.env`)
- JWT-based protected admin routes

---

## 🛏 Room Management

- Add room (Admin)
- Update room
- Delete room
- Get all rooms (Public)
- Room availability control

---

## 🍽 Dish Management

- Add dish with image upload (Cloudinary)
- Update dish
- Delete dish
- Set dish as AVAILABLE / UNAVAILABLE
- Public dish listing

---

## 🛎 Booking System

- Create booking (User)
- View own bookings
- Admin: view all bookings
- Update booking status:
  - pending
  - confirmed
  - cancelled
  - completed
- Date validation & price calculation

---

## 💳 Payments

### Supported Gateways
- Razorpay (India)
- Stripe (International)

### Flow
1. User creates booking
2. User completes payment
3. Payment linked with booking
4. Booking auto-confirmed on success
5. Room marked unavailable

---

## 📧 Email Notifications

Emails sent for:
- Booking created
- Booking confirmed after payment

Powered by **Nodemailer (Gmail App Password)**.

---

## 📊 Admin Analytics

Admin dashboard APIs provide:
- Total users
- Total rooms
- Total dishes
- Total bookings
- Total revenue
