import React, { useEffect, useState } from "react";

export const GetLocation = () => {
  const [weatherInfo, setWeatherInfo] = useState(null);

  async function getAdressFromCordinates(latitude, longitude) {
    const apiKey = '8eb77b387ddb14503409ae6bac614dbd';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    const options = {
      method: "GET",
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      console.log(result);
      const obj = {
        place: result.name + "," + result.sys.country,
        image: `http://openweathermap.org/img/wn/${result.weather[0].icon}@2x.png`,
        description: result.weather[0].description,
        wind: result.wind.speed,
        precip: result.main.humidity,
        pressure: result.main.pressure,
        temp: result.main.temp,
        temp_min:result.main.temp_min,
        temp_max:result.main.temp_max,
       sunrise:result.sys.sunrise,
        sunset:result.sys.sunset,
        visibility:result.visibility
      };
      setWeatherInfo(obj);
    } catch (error) {
      console.error(error);
    }
  }

  async function getWeatherInfoFromLocationName(cityname) {
    const apiKey = '8eb77b387ddb14503409ae6bac614dbd';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${apiKey}&units=metric`;
    const options = {
      method: "GET",
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      console.log(result);
      const obj = {
        place: result.name + "," + result.sys.country,
        image: `http://openweathermap.org/img/wn/${result.weather[0].icon}@2x.png`,
        description: result.weather[0].description,
        wind: result.wind.speed,
        precip: result.main.humidity,
        pressure: result.main.pressure,
        temp: result.main.temp,  
        temp_min:result.main.temp_min,
        temp_max:result.main.temp_max,
        
        sunrise:result.sys.sunrise,
        sunset:result.sys.sunset,
        visibility:result.visibility
      };
      setWeatherInfo(obj);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    // first check if data is already present in local storage to track user's last visit to  our app

    if(JSON.parse(localStorage.getItem('userLocation'))){
      //check whether object or string in stored in local storage
      const storedData=JSON.parse(localStorage.getItem('userLocation'));

      if(storedData instanceof Object){
        // means user location is object
        getAdressFromCordinates(storedData.latitude,storedData.longitude);
      }
      else{
        //means user location is a string
        getWeatherInfoFromLocationName(storedData);
      }

      return;
      

    }

    //below code runs if user is visiting our app for the very first time
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }

    function showPosition(position) {
      //setting latitude and longitude in local storage to track users for next time
      if(!JSON.parse(localStorage.getItem('userLocation'))){
        const userLocation={
          latitude:position.coords.latitude,
          longitude: position.coords.longitude
        }
        localStorage.setItem('userLocation',JSON.stringify(userLocation));

      }
      getAdressFromCordinates(position.coords.latitude, position.coords.longitude);
    }

    function showError(error) {
      if (error.PERMISSION_DENIED) {
        let locationName = window.prompt('Enter your current Location! or different Locations');
        if (!locationName || locationName === null) {
          while (!locationName || locationName === null) {
            locationName = window.prompt('Enter your current Location! or different Locations');
            if (locationName) {
              break;
            }
          }
        }
        //storing in local storage for the tracking user's next time visit
        if(!JSON.parse(localStorage.getItem('userLocation'))){
          localStorage.setItem('userLocation',JSON.stringify(locationName));
        }
        getWeatherInfoFromLocationName(locationName);
      }
    }
  }, []);

console.log(weatherInfo,'weatherinfo');
  return (
    <>
      {weatherInfo === null ? <h1 className="text-color">Loading...</h1> : (
        <div>
          <div className="place">
          <h2 className="text-color">{weatherInfo.place}</h2>
          </div>
          <div className="parent">

            <div className="weather-image">
            <img className='img' style={{border:0}}src={weatherInfo.image} alt="Weather icon" />
            <h4 className="text-color">{weatherInfo.description}</h4>
            </div>

            <div className="temperature">
              <h1 className="text-color">{weatherInfo.temp}°C</h1>
            </div>

            <div className="text-justify">
            <h4 className="text-color">Wind Speed: {weatherInfo.wind} m/s</h4>
          <h4 className="text-color">Humidity: {weatherInfo.precip}%</h4>
          <h4 className="text-color">Pressure: {weatherInfo.pressure} hPa</h4>
            </div>
          </div>

          {/*  */}
          <div className="temp-info">
            <div className="min_temp text-color">
              <h1>MinTemperature</h1>
              <h3>{weatherInfo.temp_min}°C</h3>
            </div>

            <div className="max_temp text-color">
              <h1>MaxTemperature</h1>
              <h3>{weatherInfo.temp_max}°C</h3>
            </div>

            <div className="sunrise text-color">
              <h1>Sunrise</h1>
              <h3>{weatherInfo.sunrise}</h3>
            </div>

            <div className="sunset text-color">
              <h1>Sunset</h1>
              <h3>{weatherInfo.sunset}</h3>
            </div>

            <div className="visibility text-color">
              <h1>visibility</h1>
              <h3>{weatherInfo.visibility}</h3>
            </div>
          </div>
          
          
        </div>
      )}
    </>
  );
};
