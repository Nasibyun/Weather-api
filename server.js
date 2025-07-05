const express = require('express');
const weatherRoutes = require('./routes/weather');
const { getWeatherByCity } = require('./services/weatherservice');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/weather', weatherRoutes);

// Auto-detect location from IP
app.get('/', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
    
    // Get location from IP
    const geo = await axios.get(`https://ipapi.co/${ip}/json/`);
    const city = geo.data.city;

    if (!city) {
      return res.status(400).json({ 
        error: 'Could not detect your location' 
      });
    }

    // Get weather for detected city
    const weather = await getWeatherByCity(city);

    res.json({
      message: 'Automatically detected your location',
      detected_ip: ip,
      location: city,
      ...weather
    });
  } catch (err) {
    console.error('Auto-location error:', err.message);
    res.status(500).json({ 
      error: 'Unable to fetch location-based weather',
      tip: 'Try /api/weather?city=your_city instead'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});