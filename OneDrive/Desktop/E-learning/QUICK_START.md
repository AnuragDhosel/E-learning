# Quick Start Guide for E-Learning Platform

## ⚠️ Important: MongoDB Setup Required

The application requires MongoDB to be running. Follow these steps:

### Option 1: MongoDB Community Edition (Recommended)

1. **Download MongoDB**:
   - Visit: https://www.mongodb.com/try/download/community
   - Download MongoDB Community Server for Windows
   - Install with default settings

2. **Verify Installation**:
   ```powershell
   mongod --version
   ```

3. **Start MongoDB**:
   ```powershell
   # If installed as a service (default)
   net start MongoDB
   
   # OR run manually in a new terminal
   mongod
   ```

### Option 2: MongoDB Atlas (Cloud - Free Tier)

If you don't want to install MongoDB locally:

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a free cluster
4. Get connection string
5. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/elearning
   ```

## 🚀 Running the Application

Once MongoDB is running:

### Terminal 1 - Backend
```powershell
cd C:\Users\mranu\OneDrive\Desktop\E-learning\backend
npm run seed     # Seed the database (first time only)
npm run dev      # Start backend server
```

Backend runs on: **http://localhost:5000**

### Terminal 2 - Frontend
```powershell
cd C:\Users\mranu\OneDrive\Desktop\E-learning\frontend
npm run dev      # Start frontend server
```

Frontend runs on: **http://localhost:3000**

## 👤 Login Credentials

**Teacher Account:**
- Email: teacher@university.edu
- Password: password123

**Student Accounts:**
- Email: student@university.edu / password123
- Email: jane@university.edu / password123

## ✅ What's Already Done

- ✅ Backend and frontend dependencies installed
- ✅ Environment files created
- ✅ All code implemented and ready
- ⏳ Waiting for MongoDB to start

## 🔍 Verify MongoDB is Running

Run this command:
```powershell
mongosh --eval "db.version()"
```

If you see a version number, MongoDB is running!

## 📞 Need Help?

If MongoDB won't start:
1. Check if it's installed: `mongod --version`
2. Try running manually: Open new terminal → `mongod`
3. Use MongoDB Atlas (cloud option) instead

Once MongoDB is running, just start the backend and frontend servers!
