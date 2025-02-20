import React from 'react';
// import './WeatherWidget.scss';

function WeatherWidget() {
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
      </div>
    </div>
  );
}

export default WeatherWidget; 