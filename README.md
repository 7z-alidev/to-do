# ? TaskPulse - Modern MERN Stack To-Do Application

A full-stack, responsive To-Do application built with MongoDB, Express.js, React, and Node.js. TaskPulse features JWT user authentication, Email OTP verification, 2FA security, customizable user avatars, productivity analytics, priority filtering, and dynamic task management.

?? **Live Demo:** [https://7z-to-do.netlify.app](https://7z-to-do.netlify.app)

---

## ? Features

- ?? **Authentication & Security**
  - User Registration & Login with JWT session management
  - Email Verification via OTP
  - Two-Factor Authentication (2FA) with authenticator apps / QR code setup
- ?? **User Profiles**
  - Custom avatar upload & preset options
- ?? **Task Management**
  - Full CRUD functionality (Create, Read, Update, Delete)
  - Category tags (Work, Personal, Urgent, Ideas)
  - Priority levels (Low, Medium, High) with visual badges
  - Due date tracking with smart formatting
  - Search, status filtering (All, Active, Completed), and sorting
- ?? **Productivity Analytics**
  - Real-time task statistics overview (Total, Active, Completed, Completion Rate)
- ?? **Modern UI/UX**
  - Sleek dark theme with vibrant glassmorphism design
  - Responsive design for mobile, tablet, and desktop

---

## ??? Tech Stack

- **Frontend:** React, Vite, Lucide Icons, Modern CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Deployment:** Netlify (Frontend), Render (Backend)

---

## ?? Getting Started Locally

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas cluster or local MongoDB connection

### Installation

1. **Clone the repository:**
   \\\ash
   git clone https://github.com/7z-alidev/to-do.git
   cd to-do
   \\\

2. **Install dependencies:**
   \\\ash
   npm run install:all
   \\\

3. **Configure Environment Variables:**
   Create a \.env\ file in the \ackend/\ directory:
   \\\env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   CLIENT_URL=http://localhost:5173
   \\\

4. **Run the Application:**
   \\\ash
   npm run dev
   \\\
   - Frontend: \http://localhost:5173\
   - Backend: \http://localhost:5000\

---

## ?? Repository & Live App

- **Live Frontend:** [https://7z-to-do.netlify.app](https://7z-to-do.netlify.app)
- **GitHub Repository:** [https://github.com/7z-alidev/to-do](https://github.com/7z-alidev/to-do)
