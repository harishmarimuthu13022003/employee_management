# Employee Management Dashboard (MERN Stack)
**Live** : https://employee-management-delta-livid.vercel.app/
A professional, scalable, and fully responsive Employee Management Dashboard featuring JWT authentication, full CRUD operations, search & filter utilities, and visual analytics dashboards.

---

## 🚀 Key Features

* **JWT-Based Authentication:** Complete sign‑in / sign‑out security storing tokens in `localStorage` with automated API route protection.
* **Unified Database Fallback:** Connects to a local MongoDB instance. If MongoDB is not running, the backend automatically falls back to a high‑fidelity local JSON‑file database, ensuring zero‑config out‑of‑the‑box operation.
* **Comprehensive CRUD Operations:** Add, update, and delete employees with safety confirmation popups.
* **Smart Search & Filters:** Real‑time debounced searching by name/email along with instant filters for status and department.
* **Analytics Dashboard:** Graphical stats visualization utilizing `Recharts`:
  * Key Metrics Cards (Total, Active, Inactive, and On Leave employees)
  * Department‑wise count distribution (Bar Chart)
  * Employee Status distribution (Pie Chart)
  * Chronological Monthly joined trend (Area / Line Chart)
* **Responsive Layout:** Sleek modern dashboard shell with a sliding sidebar drawer for mobile viewports.

---

## 🛠️ Tech Stack

* **Frontend:** React (Vite), React Router DOM, Axios, Context API, Tailwind CSS, Lucide Icons, Recharts
* **Backend:** Node.js, Express, MongoDB (via Mongoose), JSON‑file fallback storage
* **Security:** JWT (JSON Web Tokens), Bcrypt.js (Password hashing)

---

## 📂 Project Structure

```
employee_management/
├── backend/
│   ├── config/          # DB connection configuration
│   ├── data/            # JSON database folder (fallback)
│   ├── middleware/      # Authentication middleware (JWT checks)
│   ├── models/          # MongoDB Mongoose models (User, Employee)
│   ├── routes/          # Express API route modules (auth, employees)
│   ├── .env             # Environment configs (Port, DB URI, JWT secret)
│   ├── package.json     # Node scripts and dependencies
│   └── server.js        # Express API Server entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Protected Routes, Modals, popups
│   │   ├── context/     # AuthContext (global state)
│   │   ├── layouts/     # DashboardLayout shell (responsive sidebar)
│   │   ├── pages/       # Login, Analytics, and Employee listing
│   │   ├── utils/       # Axios API client helper
│   │   ├── App.jsx      # React router routes mapping
│   │   ├── main.jsx     # App entry point
│   │   └── index.css    # Tailwind CSS and root styles
│   └── package.json     # React scripts and dependencies
└── README.md            # Documentation guide
```

---

## 🔑 Default Administrator Credentials

When launching the backend for the first time, the database checks for accounts. If empty, it **automatically seeds** a default administrator user:

* **Email:** `admin@example.com`
* **Password:** `password123`

> **Note:** The login page now includes a *Default Sandbox Login* banner. Clicking it automatically fills the email and password fields with the credentials above for quick testing.

---

## ⚙️ Quick Start Guide

### Prerequisite
* [Node.js](https://nodejs.org/) (v16 or higher recommended)
* Optional: Local MongoDB running at `mongodb://localhost:27017`

### 1. Launch the Backend API
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install Node packages:
   ```bash
   npm install
   ```
3. Start the Express server in development (hot‑reload) mode:
   ```bash
   npm run dev
   ```
   The backend API will start at **`http://localhost:5000`**.

### 2. Launch the Frontend UI
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   The Vite client will start at **`http://localhost:5173`** (or the next available port). Open this address in your web browser.
```
