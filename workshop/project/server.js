const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const catController = require('./controllers/catController');
const { connectDB } = require('./models/catModel');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/api/cats', catController.getCats);
app.post('/api/cat', catController.addCat);

// MongoDB connection and server start
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });
