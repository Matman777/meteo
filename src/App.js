import React, { useState, useEffect } from "react";
import './index.css';


// API call for the list of towns/countries
const url = 'https://wft-geo-db.p.rapidapi.com/v1/geo/adminDivisions';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'SIGN-UP-FOR-KEY',
		'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.text();
	console.log(result);
} catch (error) {
	console.error(error);
}




// API call for the weather
const api = {
  key: "3dd8ffa94db3f7bd6b6e9e7f1abb5f38",
  base: "https://api.openweathermap.org/data/2.5/weather"
}

const weatherDescriptions = {
  "Clear": "Dégagé",
  "Clouds": "Nuageux",
  "Rain": "Pluie",
  "Thunderstorm": "Orageux",
  "Mist": "Brouillard",
  "Snow": "Neige"
};


function App() {

  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState ({});


  useEffect(() => {
    if (typeof weather.weather !== "undefined") {
      // Supprime toutes les classes de condition météorologique existantes
      document.body.classList.remove("clouds", "rain", "thunderstorm", "clear", "mist", "snow");
      
      // Ajoute la nouvelle classe basée sur la condition météorologique actuelle
      document.body.classList.add(weather.weather[0].main.toLowerCase());
    }
  }, [weather]);




  function search(evt) {
    if (evt.key === "Enter") {
      fetch(`${api.base}?q=${query.trim()}&units=metric&APPID=${api.key}`)
        .then(res => res.json())
        .then(result => {
          setWeather(result);
          setQuery('');
        });
    }
  }

  const dateBuilder = (d) => {
    let months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", 
    "Octobre", "Novembre", "Décembre"];
    let days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`
  }


  return (
    <div className={`app ${(!weather.main || typeof weather.main === "undefined") ? 'base' : ''}`}>
      <main>
        <div className="search-box">
          <input 
            type="text"
            className="search-bar"
            placeholder="Recherchez une ville ou un pays..."
            onChange={e => setQuery(e.target.value)}
            value={query}
            onKeyPress={search}
          />
        </div>
        {(typeof weather.main != "undefined") ? (
        <div>
          <div className="location-box">
            <div className="location">{weather.name}, {weather.sys.country}</div>
            <div className="date">{dateBuilder(new Date())}</div>
            </div>
          <div className="weather-box">
            <div className="temp">
              {Math.round(weather.main.temp)}°c
            </div>

            <div className="weather">
              {weatherDescriptions[weather.weather[0].main] || weather.weather[0].main}
            </div>
          </div>
        </div>
        ) : ('')}
      </main>
    </div>
  );
}

export default App;
