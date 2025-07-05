const express = require('express');
const router = express.Router();
const { getWeatherByCity } = require('../services/weatherservice');

// GET /api/weather?city=Delhi
router.get('/', async (req, res) => {
  const city = req.query.city;
  if (!city) {
    return res.status(400).json({ error: 'Missing required query parameter: city' });
  }

  try {
    const weatherData = await getWeatherByCity(city);
    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

module.exports = router;
