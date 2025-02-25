import React, { useState, useEffect } from 'react';
;

function WeatherWidget() {
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [currentTime, setCurrentTime] = useState(new Date());

 
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);


  const getWeatherClass = (hour, condition) => {
    if (condition.includes("Rain")) return "weather-widget--rain";
    if (condition.includes("Snow")) return "weather-widget--snow";
    if (condition.includes("Fog")) return "weather-widget--fog";
    

    if (hour >= 5 && hour < 12) return "weather-widget--morning";
    if (hour >= 12 && hour < 17) return "weather-widget--afternoon";
    if (hour >= 17 && hour < 20) return "weather-widget--evening";
    return "weather-widget--night";
  };

  const getTimeOfDayMessage = (hour) => {
    if (hour >= 6 && hour < 12) return "🌅 Cool Morning Breeze";
    if (hour >= 12 && hour < 18) return "🌞 Warm Afternoon";
    if (hour >= 18 && hour < 21) return "🌆 Sunset Glow";
    return "🌙 Chilly Night";
  };

  const getTaskSuggestion = (condition, hour) => {
    if (condition.includes("Rain")) {
      return "☔ Perfect time for focused indoor tasks";
    }
    if (condition.includes("Cloudy")) {
      return "☁️ Ideal lighting for screen work";
    }
    if (condition.includes("Snow")) {
      return "❄️ Cozy weather for planning & reflection";
    }
    if (condition.includes("Fog")) {
      return "🌫️ Good moment for mindful work sessions";
    }
    if (condition.includes("Storm")) {
      return "⛈️ Time to review & organize projects";
    }
    
    if (hour < 10) {
      return "🌅 Fresh mind, tackle important tasks first";
    }
    if (hour < 14) {
      return "☀️ Mix outdoor breaks with focused work";
    }
    if (hour < 17) {
      return "🌤️ Balance productivity with short walks";
    }
    if (hour < 20) {
      return "🌆 Wrap up tasks as day winds down";
    }
    return "🌙 Time for lighter, creative work";
  };

  const weatherCondition = "Partly Cloudy";
  const weatherClass = getWeatherClass(currentHour, weatherCondition);

  return (
    <div className={`weather-widget ${weatherClass}`}>
      {/* Dynamic weather effects */}
      <div className="weather-widget__effects">
        {weatherCondition.includes("Rain") && <div className="weather-widget__rain" />}
        {weatherCondition.includes("Snow") && <div className="weather-widget__snow" />}
        {weatherCondition.includes("Fog") && <div className="weather-widget__fog" />}
        {weatherCondition.includes("Clear") && <div className="weather-widget__sun-glow" />}
      </div>

      <div className="weather-widget__content">
        <div className="weather-widget__temp">
          72°F
          <span className="weather-widget__temp-trend">↑</span>
        </div>
        <div className="weather-widget__desc">{weatherCondition}</div>
        <div className="weather-widget__time">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="weather-widget__time-message">
          {getTimeOfDayMessage(currentHour)}
        </div>
        <div className="weather-widget__task-suggestion">
          {getTaskSuggestion(weatherCondition, currentHour)}
        </div>
      </div>
    </div>
  );
}

export default WeatherWidget; 