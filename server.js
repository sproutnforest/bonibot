require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = process.env.DB_NAME || 'bonibot_data';

let db;
const client = new MongoClient(MONGO_URI);

// CORS setup
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    mongo: db ? 'Connected' : 'Disconnected',
  });
});

// Forwarding route
app.post('/', async (req, res) => {
  try {
    const response = await axios.post('https://bebonibot.vibindo.com', req.body, {
      headers: { 'Content-Type': 'application/json' },
    });

    console.log('[API Forward] ✅ Response:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('[API Forward] ❌ Error:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch from API',
      details: error.message,
    });
  }
});

// Insert data into MongoDB
app.post('/addData', async (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ error: 'Invalid or missing JSON body' });
    }

    const chatCollection = db.collection('chat_data');
    const newData = req.body;

    console.log('[MongoDB] 📝 Inserting new data:', newData);
    const result = await chatCollection.insertOne(newData);

    res.status(201).json({ insertedId: result.insertedId });
  } catch (error) {
    console.error('[MongoDB] ❌ Insert error:', error);
    res.status(500).send('Error inserting data into MongoDB');
  }
});

// MongoDB connection with retry logic
async function main() {
  let retries = 5;
  let serverStarted = false;

  while (retries) {
    try {
      await client.connect();
      db = client.db(DB_NAME);
      console.log('[MongoDB] ✅ Connected');

      if (!serverStarted) {
        app.listen(PORT, '0.0.0.0', () => {
          console.log(`🚀 Server running at http://localhost:${PORT}`);
        });
        serverStarted = true;
      }

      break;
    } catch (err) {
      console.error(`[MongoDB] ❌ Connection failed (${retries} retries left):`, err.message);
      retries--;
      if (retries === 0) process.exit(1);
      await new Promise(res => setTimeout(res, 5000));
    }
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n👋 Gracefully shutting down...');
  try {
    await client.close();
    console.log('[MongoDB] 🔌 Disconnected');
  } catch (err) {
    console.error('[MongoDB] ❌ Error on shutdown:', err);
  } finally {
    process.exit(0);
  }
});

main();
