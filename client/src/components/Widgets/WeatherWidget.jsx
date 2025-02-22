import React, { useState, useEffect } from 'react';
// import './WeatherWidget.scss';

function WeatherWidget() {
  const [currentHour, setCurrentHour] = useState(new Date().getHours());

  const getTimeOfDayMessage = (hour) => {
    if (hour >= 6 && hour < 12) return "🌅 Cool Morning Breeze";
    if (hour >= 12 && hour < 18) return "🌞 Warm Afternoon";
    if (hour >= 18 && hour < 21) return "🌆 Sunset Glow";
    return "🌙 Chilly Night";
  };

  const getTaskSuggestion = (condition, hour) => {
    if (condition.includes("Rain")) return "☔ Indoor work is best today!";
    if (condition.includes("Sunny")) return hour < 18 ? "☀️ Outdoor activities are great now!" : "🌙 Relax and wind down.";
    if (condition.includes("Snow")) return "❄️ Stay cozy! A good time for planning tasks.";
    return "📋 A great time for deep work.";
  };

  return (
    <div className="weather-widget">
      <h3 className="weather-widget__title">Weather</h3>
      <div className="weather-widget__content">
        <div className="weather-widget__temp">72°F</div>
        <div className="weather-widget__desc">Partly Cloudy</div>
        <div className="weather-widget__details">
          <span>Humidity: 65%</span>
          <span>Wind: 5 mph</span>
        </div>
        <div className="weather-widget__time-message">
          {getTimeOfDayMessage(currentHour)}
        </div>
        <div className="weather-widget__task-suggestion">
          {getTaskSuggestion("Partly Cloudy", currentHour)}
        </div>
      </div>
    </div>
  );
}

export default WeatherWidget; 