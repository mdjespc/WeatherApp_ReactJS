import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './App.css';
import moment from 'moment-timezone';

function WeatherApp(){
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() =>{
    const fetchWeatherData = async () =>{
      try{
        //Get user's location
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const {latitude, longitude} = position.coords;
            //Fetch weather using user's coordinates
            const response = await axios.get(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`
            );
            setWeatherData(response.data);
          },
          (error) => {
            console.error('Error getting location', error.message);
          }
        );
      }catch(error){
        console.error('Error fetching weather data:', error);
      }
    };
    fetchWeatherData();
  }, [] );

  // Convert GMT time to user's local timezone
  const convertToUserTimezone = (gmtTime) => {
    const userTimezone = moment.tz.guess(); // Get user's timezone
    return moment(gmtTime).tz("EST").format('HH:mm');
  };

  //Lambda expression to map a weather code to a stringified description
  const getConditionFromWeatherCode = (code) => {
    switch(code)
      {
        case 0:
          return "Clear sky";
        case 1:
          return "Partly cloudy";
        case 2:
          return "Cloudy";
        case 3:
          return "Rainy";
        default:
          return "Unknown";
      }
  }


  return (
    <div className="container" style={{ backgroundImage: weatherData ? url(`resources/images/weather_${weatherData.current.weather_code}.png`) : 'gray' }}>
      <h1 className="header">Weather App</h1>
      {weatherData ? (
        <div>
          <p className="time">{convertToUserTimezone(weatherData.current.time)}</p>
          <h2>The weather in your area:</h2>
          <p className="temperature">{Math.floor(weatherData.current.temperature_2m * (9 / 5) + 32)}°F</p>
          <p className="conditions">{getConditionFromWeatherCode(weatherData.current.weather_code)}</p>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  );

}

export default WeatherApp;