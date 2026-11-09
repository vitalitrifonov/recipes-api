# 🍲 Recipes Web App & REST API

A full-stack web application and REST API for recipe management, user authentication, and comments system.

## 🚀 Tech Stack

* **Frontend:** React (Vite), JavaScript (ES6+), HTML5, CSS3
* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose ORM
* **Authentication:** Clerk (JWT, Webhooks via Svix)
* **Dev Tools & Testing:** Postman, ngrok, Git

---

## 🔑 Key Features

* **Authentication & Authorization:** Secure sign-up/sign-in managed via Clerk SDK, JWT tokens, and Svix webhooks for syncing user data with MongoDB.
* **Recipes CRUD:** Create, read, and delete recipe posts (slug-based navigation supported).
* **Comments System:** Authenticated users can comment on recipes, and manage their own comments.
* **Role-Based Access:** Admins have permission to manage and delete any posts or comments across the app.
* **API Testing:** Built and verified end-to-end using Postman.

---

## 🛠️ Setup & Installation

### Prerequisites
* Node.js (v18+ recommended)
* MongoDB database connection URL
* Clerk Account API keys

### 1. Backend Setup
git clone [https://github.com/vitalitrifonov/recipes-api.git](https://github.com/vitalitrifonov/recipes-api.git)
cd recipes-api/backend

# Install dependencies
npm install

# Configure environment variables (.env)
# Create a .env file and add your MONGODB_URI and CLERK keys

# Run the backend server
node --watch --env-file=.env index.js

### 2. Frontend Setup
cd ../client

# Install dependencies
npm install

# Start development server
npm run dev

---

## 📖 API Documentation & Media
* Demo Video: [https://youtu.be/7zfhRy9kGaM](https://youtu.be/7zfhRy9kGaM)
* Full API documentation in Estonian is available in RECIPES API DOKUMENTATSIOON.pdf.
