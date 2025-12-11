# AI Chat Application

A full-stack chat application where users can interact with an AI assistant. All conversations are persisted in a database and restored when the page is refreshed.

## 🚀 Features

- **Real-time AI Chat**: Interact with an AI assistant powered by Hugging Face
- **Persistent Storage**: All messages are saved in SQLite database
- **Chat History**: Previous conversations are automatically loaded on page refresh
- **Modern UI**: Beautiful, responsive chat interface with smooth animations
- **RESTful API**: Clean backend API for chat operations

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express
- **SQLite** (better-sqlite3) for data persistence
- **Hugging Face API** for AI responses
- **CORS** enabled for frontend communication

### Frontend
- **React 18** with modern hooks
- **Vite** for fast development and building
- **CSS3** with gradients and animations
- **Responsive Design** for all screen sizes

## 📁 Project Structure

```
unstop_waaliintern/
├── backend/
│   ├── server.js          # Express server with API endpoints
│   ├── package.json       # Backend dependencies
│   ├── chat.db           # SQLite database (auto-generated)
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── App.jsx       # Main React component
│   │   ├── App.css       # Styling
│   │   └── main.jsx      # React entry point
│   ├── index.html        # HTML template
│   ├── vite.config.js    # Vite configuration
│   ├── package.json      # Frontend dependencies
│   └── .gitignore
└── README.md
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The backend server will start on `http://localhost:3001`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will open automatically at `http://localhost:5173`

## 🎯 Usage

1. **Start Both Servers**: Make sure both backend (port 3001) and frontend (port 5173) are running
2. **Open Browser**: Navigate to `http://localhost:5173`
3. **Start Chatting**: Type a message and click "Send"
4. **AI Response**: The AI will respond, and both messages are saved
5. **Refresh Page**: Reload the browser to see all previous messages restored

## 📡 API Endpoints

### GET `/api/history`
Fetch all chat messages from the database.

**Response:**
```json
[
  {
    "id": 1,
    "role": "user",
    "content": "Hello!",
    "timestamp": "2024-01-01 12:00:00"
  },
  {
    "id": 2,
    "role": "assistant",
    "content": "Hi! How can I help you?",
    "timestamp": "2024-01-01 12:00:01"
  }
]
```

### POST `/api/chat`
Send a user message and receive an AI response.

**Request Body:**
```json
{
  "message": "What is AI?"
}
```

**Response:**
```json
{
  "userMessage": {
    "role": "user",
    "content": "What is AI?"
  },
  "aiMessage": {
    "id": 3,
    "role": "assistant",
    "content": "AI stands for Artificial Intelligence...",
    "timestamp": "2024-01-01 12:00:02"
  }
}
```

### DELETE `/api/history` (Optional)
Clear all chat history from the database.

## 🎨 UI Features

- **Gradient Backgrounds**: Modern purple gradient theme
- **Smooth Animations**: Fade-in effects for messages
- **Auto-scroll**: Automatically scrolls to latest message
- **Loading States**: Visual feedback while AI is responding
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Empty State**: Helpful prompt when no messages exist

## 🔄 How It Works

1. User types a message and clicks "Send"
2. Frontend sends POST request to `/api/chat`
3. Backend saves user message to SQLite database
4. Backend calls Hugging Face AI API
5. Backend saves AI response to database
6. Backend returns both messages to frontend
7. Frontend displays the conversation
8. On page reload, frontend fetches all messages via `/api/history`

## 🚨 Troubleshooting

**Backend won't start:**
- Make sure port 3001 is not in use
- Check that all dependencies are installed (`npm install`)

**Frontend can't connect to backend:**
- Verify backend is running on port 3001
- Check browser console for CORS errors
- Ensure API_URL in App.jsx matches backend URL

**AI responses are slow or fail:**
- Hugging Face API may have rate limits
- Check backend console for error messages
- Fallback responses will be used if AI is unavailable

## 📝 Notes

- The SQLite database file (`chat.db`) is created automatically on first run
- Chat history persists across server restarts
- The AI uses Hugging Face's free inference API (no API key required)
- Fallback responses are provided when AI service is unavailable

## 🔮 Future Enhancements

- User authentication
- Multiple chat sessions
- Message editing/deletion
- File attachments
- Voice input
- Different AI models selection
- Export chat history

## 📄 License

MIT License - feel free to use this project for learning or development purposes.
