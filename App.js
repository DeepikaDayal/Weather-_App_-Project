import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_KEY = '8b5ef03854604f562b8e702dcd48cebf'; // Your API key
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async (cityName) => {
    if (!cityName) return;
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_URL}?q=${cityName}&appid=${API_KEY}&units=metric`);
      setWeather(response.data);
    } catch (err) {
      setError('City not found or API error. Please try again.');
    }
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather(city);
  };

  // Dynamic background based on weather
  const getBackgroundClass = () => {
    if (!weather) return 'default-bg';
    const condition = weather.weather[0].main.toLowerCase();
    if (condition.includes('clear')) return 'sunny-bg';
    if (condition.includes('cloud')) return 'cloudy-bg';
    if (condition.includes('rain')) return 'rainy-bg';
    if (condition.includes('snow')) return 'snowy-bg';
    return 'default-bg';
  };

  return (
    <div className={`app ${getBackgroundClass()}`}>
      <div className="container">
        <h1 className="title">Weather App</h1>
        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">Search</button>
        </form>
        {loading && <p className="loading">Loading...</p>}
        {error && <p className="error">{error}</p>}
        {weather && (
          <div className="weather-card">
            <h2>{weather.name}, {weather.sys.country}</h2>
            <div className="weather-info">
              <img
                src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
                className="weather-icon"
              />
              <div className="details">
                <p className="temp">{Math.round(weather.main.temp)}°C</p>
                <p className="desc">{weather.weather[0].description}</p>
                <p>Humidity: {weather.main.humidity}%</p>
                <p>Wind Speed: {weather.wind.speed} m/s</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;