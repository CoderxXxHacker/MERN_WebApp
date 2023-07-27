// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const Data = require('./models/data'); // Import the Data model
const cors = require('cors');
// ...


const app = express();
const server = http.createServer(app);

app.use(cors());
var io = require('socket.io')(server, {
  cors: {
    origin: true,
    credentials: true,
  },
  allowEIO3: true,
  
});

const port = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/live_charts_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Set up WebSocket for real-time updates
io.on('connection', (socket) => {
  console.log('A user connected');

  // Emit real-time updates when data changes in MongoDB
  Data.watch().on('change', (change) => {
    io.emit('dataUpdate', change.fullDocument);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// API routes
app.get('/api/data', async (req, res) => {
  try {
    const data = await Data.find().sort({ timestamp: 1 }).exec();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
