// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3001;

app.use(cors());

const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);

app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const response = await axios.post('https://bebonibot.vibindo.com', req.body, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log('Response from API:', response.data);

    res.json(response.data);

  } catch (error) {
    console.error('Error forwarding request:', error.message);

    res.status(error.response ? error.response.status : 500).json({
      error: 'Failed to fetch data from API',
      details: error.message
    });
  }
});

app.post('/addData', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('bonibot_data');
    const chatCollection = database.collection('chat_data');

    const newData = req.body;
    console.log("Received new piece:", newData);
    const result = await chatCollection.insertOne(newData);
    res.status(201).json({insertedId: result.insertedId});
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send('Error inserting data into MongoDB');
  }
})

app.post('/viewData', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('bonibot_data');
    const chatCollection = database.collection('chat_data');
    const data = await collection.find().toArray();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send('Error inserting data into MongoDB');
  }
})

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
