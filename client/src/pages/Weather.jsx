import AnimatedPage from "../components/AnimatedPage";

function Weather() {
  return (
    <div className="weather">
      <div className="weather__header">
        <h2 className="weather__title">Weather Forecast</h2>
      </div>

      <div className="weather__content">
        <div className="weather__card">
          <h3 className="weather__card-title">Current Weather</h3>
          <div className="weather__card-content">
            <div className="weather__current">
              <div className="weather__current-temp">72°F</div>
              <div className="weather__current-desc">Partly Cloudy</div>
              <div className="weather__current-details">
                <span className="weather__current-humidity">Humidity: 65%</span>
                <span className="weather__current-wind">Wind: 5 mph</span>
              </div>
            </div>
          </div>
        </div>

        <div className="weather__card">
          <h3 className="weather__card-title">Sun Schedule</h3>
          <div className="weather__card-content">
            <div className="weather__sun">
              <div className="weather__sun-item">
                <span className="weather__sun-label">Sunrise</span>
                <span className="weather__sun-time">6:45 AM</span>
              </div>
              <div className="weather__sun-item">
                <span className="weather__sun-label">Sunset</span>
                <span className="weather__sun-time">7:30 PM</span>
              </div>
              <div className="weather__sun-item">
                <span className="weather__sun-label">Day Length</span>
                <span className="weather__sun-time">12h 45m</span>
              </div>
            </div>
          </div>
        </div>

        <div className="weather__card">
          <h3 className="weather__card-title">5-Day Forecast</h3>
          <div className="weather__card-content">
            <div className="weather__forecast">
              {/* Forecast items would be mapped here */}
              <div className="weather__forecast-item">
                <span className="weather__forecast-day">Mon</span>
                <span className="weather__forecast-temp">75°F</span>
                <span className="weather__forecast-desc">Sunny</span>
              </div>
              {/* More forecast items */}
            </div>
          </div>
        </div>

        <div className="weather__card">
          <h3 className="weather__card-title">Weather Alerts</h3>
          <div className="weather__card-content">
            <div className="weather__alerts">
              <div className="weather__alerts-item">
                <span className="weather__alerts-type">No current alerts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;
