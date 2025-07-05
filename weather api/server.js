const express = require('express');
const weatherRoutes = require('./routes/weather');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/api/weather', weatherRoutes);

app.get('/', (req, res) => {
  res.send('🌦️ Weather Data API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
