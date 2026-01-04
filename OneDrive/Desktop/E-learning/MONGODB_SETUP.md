# MongoDB Local Installation Guide for E-Learning Platform

## 🔍 Status: MongoDB Not Detected

MongoDB needs to be installed on your system to run this application locally.

## 📥 Option 1: Install MongoDB Community Edition (Recommended)

### Step 1: Download MongoDB
1. Visit: **https://www.mongodb.com/try/download/community**
2. Select:
   - **Version**: Latest (7.0 or higher)
   - **Platform**: Windows
   - **Package**: MSI
3. Click **Download**

### Step 2: Install MongoDB
1. Run the downloaded MSI installer
2. Choose **Complete** installation
3. **IMPORTANT**: Check "Install MongoDB as a Service"
4. Keep default settings:
   - Service Name: MongoDB
   - Data Directory: C:\Program Files\MongoDB\Server\7.0\data\
   - Log Directory: C:\Program Files\MongoDB\Server\7.0\log\

### Step 3: Verify Installation
Open a **NEW** PowerShell window (as Administrator) and run:
```powershell
mongod --version
```

You should see the MongoDB version information.

### Step 4: Start MongoDB Service
```powershell
net start MongoDB
```

---

## 📥 Option 2: Quick Install with Chocolatey (If you have Chocolatey)

```powershell
# Run as Administrator
choco install mongodb -y
```

---

## ✅ After MongoDB is Installed and Running

### 1. Seed the Database
Open PowerShell in the backend folder:
```powershell
cd C:\Users\mranu\OneDrive\Desktop\E-learning\backend
npm run seed
```

You should see:
```
✅ Database seeded successfully!

--- Sample Credentials ---
Teacher: teacher@university.edu / password123
Student 1: student@university.edu / password123
Student 2: jane@university.edu / password123
```

### 2. Start Backend Server (Terminal 1)
```powershell
cd C:\Users\mranu\OneDrive\Desktop\E-learning\backend
npm run dev
```

Expected output:
```
Server is running on port 5000
MongoDB Connected: localhost:27017
```

### 3. Start Frontend Server (Terminal 2)
```powershell
cd C:\Users\mranu\OneDrive\Desktop\E-learning\frontend
npm run dev
```

Expected output:
```
VITE ready in XXX ms
➜ Local: http://localhost:3000/
```

### 4. Access the Application
Open your browser and go to: **http://localhost:3000**

---

## 🔧 Troubleshooting

### MongoDB won't start?
```powershell
# Check if service exists
sc query MongoDB

# Manually start MongoDB
mongod --dbpath "C:\data\db"
```

### Connection refused error?
Make sure MongoDB service is running:
```powershell
Get-Service MongoDB
```

### Port already in use?
Check if something is using port 27017:
```powershell
netstat -ano | findstr :27017
```

---

## 📌 Quick Status Check

Run these commands to verify everything:

```powershell
# 1. Check MongoDB
mongod --version

# 2. Check if MongoDB service is running
Get-Service MongoDB

# 3. Test connection
mongosh --eval "db.version()"
```

All three should work without errors!

---

## 🚀 Once MongoDB is Running

Just run the seed command and start both servers. The application will be ready to use!

**Login at http://localhost:3000 with:**
- Teacher: teacher@university.edu / password123
- Student: student@university.edu / password123
