const axios = require('axios');

const getWeatherByCity = async (city) => {
  const apiKey = process.env.API_KEY;
  const endpoint = 'https://api.openweathermap.org/data/2.5/weather';
  
  const params = {
    q: city,
    appid: apiKey,
    units: 'metric',
  };

  try {
    const response = await axios.get(endpoint, { params });
    const data = response.data;

    return {
      city: data.name,
      country: data.sys.country,
      coordinates: {
        lat: data.coord.lat,
        lon: data.coord.lon,
      },
      temperature: `${data.main.temp}°C`,
      feels_like: `${data.main.feels_like}°C`,
      humidity: `${data.main.humidity}%`,
      pressure: `${data.main.pressure} hPa`,
      wind_speed: `${data.wind.speed} m/s`,
      weather: data.weather[0].main,
      description: data.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`
    };
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('City not found');
    }
    throw new Error('Failed to fetch weather data');
  }
};

module.exports = { getWeatherByCity };