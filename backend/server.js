import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new Database('chat.db');

// Create messages table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);


const GROQ_API_KEY = process.env.GROQ_API_KEY || 'dummy_key_for_build';

// Get chat history
app.get('/api/history', (req, res) => {
  try {
    const messages = db.prepare('SELECT * FROM messages ORDER BY timestamp ASC').all();
    res.json(messages);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

// Send message and get AI response
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    // Save user message
    const insertUser = db.prepare('INSERT INTO messages (role, content) VALUES (?, ?)');
    insertUser.run('user', message);

    // Check if API key is set
    if (GROQ_API_KEY === 'YOUR_API_KEY_HERE') {
      const aiResponse = '⚠️ Please add your Groq API key in server.js. Get it FREE from: https://console.groq.com/keys (Much better than Gemini!)';

      const insertAI = db.prepare('INSERT INTO messages (role, content) VALUES (?, ?)');
      const result = insertAI.run('assistant', aiResponse);
      const aiMessage = db.prepare('SELECT * FROM messages WHERE id = ?').get(result.lastInsertRowid);

      return res.json({
        userMessage: { role: 'user', content: message },
        aiMessage: aiMessage
      });
    }


    let aiResponse = '';
    try {
      const response = await fetch(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile', // Latest and best model
            messages: [
              {
                role: 'user',
                content: message
              }
            ],
            temperature: 0.7,
            max_tokens: 500
          }),
        }
      );

      const data = await response.json();
      console.log('Groq API Response:', JSON.stringify(data, null, 2));

      if (data.error) {
        console.error('Groq API error:', data.error);
        aiResponse = `API Error: ${data.error.message}. Please check your API key.`;
      } else if (data.choices && data.choices[0]?.message?.content) {
        aiResponse = data.choices[0].message.content;
      } else {
        console.warn('Unexpected response format:', data);
        aiResponse = "I received an unexpected response from the AI. Please try again.";
      }
    } catch (aiError) {
      console.error('AI API error:', aiError);
      aiResponse = `Error connecting to AI: ${aiError.message}`;
    }

    // Save AI response
    const insertAI = db.prepare('INSERT INTO messages (role, content) VALUES (?, ?)');
    const result = insertAI.run('assistant', aiResponse);

    // Get the saved AI message
    const aiMessage = db.prepare('SELECT * FROM messages WHERE id = ?').get(result.lastInsertRowid);

    res.json({
      userMessage: { role: 'user', content: message },
      aiMessage: aiMessage
    });
  } catch (error) {
    console.error('Error processing chat:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Clear chat history
app.delete('/api/history', (req, res) => {
  try {
    db.prepare('DELETE FROM messages').run();
    res.json({ message: 'Chat history cleared' });
  } catch (error) {
    console.error('Error clearing history:', error);
    res.status(500).json({ error: 'Failed to clear history' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Database initialized at chat.db`);
  console.log(`🤖 Using Groq AI (Llama 3.3 70B) - SUPER FAST!`);
  if (GROQ_API_KEY === 'YOUR_API_KEY_HERE') {
    console.log(`⚠️  WARNING: Please add your Groq API key in server.js`);
    console.log(`   Get it FREE from: https://console.groq.com/keys`);
    console.log(`   ✨ Groq is MUCH faster and more reliable than Gemini!`);
  } else {
    console.log(`✅ API key configured`);
  }
});
