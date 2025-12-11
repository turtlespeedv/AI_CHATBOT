# Setup Instructions for AI Chat Application

## 🔑 Get Your Free Google Gemini API Key

1. **Go to**: https://makersuite.google.com/app/apikey
2. **Sign in** with your Google account
3. **Click** "Create API Key"
4. **Copy** the API key

## 📝 Add API Key to Backend

1. Open `backend/server.js`
2. Find line 24:
   ```javascript
   const GEMINI_API_KEY = 'YOUR_API_KEY_HERE';
   ```
3. Replace `YOUR_API_KEY_HERE` with your actual API key:
   ```javascript
   const GEMINI_API_KEY = 'AIzaSyC...your-actual-key...';
   ```
4. Save the file

## 🚀 Start the Application

### Terminal 1 - Backend:
```bash
cd backend
npm start
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

## 🌐 Open in Browser

Navigate to: **http://localhost:5173**

## ✨ What You'll Get

- **Google Gemini Pro** - One of the best AI models available
- **Intelligent responses** - Actually answers your questions correctly
- **Free tier** - Generous free quota
- **Fast** - Quick response times
- **Reliable** - Stable API

## 🎯 Why Gemini?

- ✅ **Smart**: Understands context and nuance
- ✅ **Accurate**: Provides factual, relevant answers
- ✅ **Free**: Generous free tier (60 requests/minute)
- ✅ **Easy**: Simple API, no complex setup
- ✅ **Reliable**: Google's infrastructure

## 🔧 Alternative: OpenAI GPT

If you prefer OpenAI instead, I can switch to that. You'll need:
- API Key from: https://platform.openai.com/api-keys
- Model: GPT-3.5-turbo or GPT-4

Let me know if you want to use OpenAI instead!
