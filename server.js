const express = require('express');
const weatherRoutes = require('./routes/weather.js');
const { getWeatherByCity } = require('./services/weatherservice');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/api/weather', weatherRoutes);

app.get('/', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
    
    // Use a free IP-to-location API
    const geo = await axios.get(`https://ipapi.co/${ip}/json/`);
    const city = geo.data.city;

    if (!city) {
      return res.status(400).json({ error: 'Could not detect city from IP' });
    }

    const weather = await getWeatherByCity(city);

    res.json({
      location: city,
      detected_ip: ip,
      ...weather
    });
  } catch (err) {
    console.error('🌍 Auto-location error:', err.message);
    res.status(500).json({ error: 'Unable to fetch location-based weather' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
