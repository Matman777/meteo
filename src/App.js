import React, { useState, useEffect } from "react";
import './index.css';
import { getLocation } from "./geoLoc";
import Card from "./Card";


// API call for the list of towns/countries
// const url = 'https://wft-geo-db.p.rapidapi.com/v1/geo/adminDivisions';
// const options = {
// 	method: 'GET',
// 	headers: {
// 		'X-RapidAPI-Key': 'SIGN-UP-FOR-KEY',
// 		'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
// 	}
// };

const url = 'https://world-geo-data.p.rapidapi.com/countries/US?language=en%2Cru%2Czh%2Ces%2Car%2Cfr%2Cfa%2Cja%2Cpl%2Cit%2Cpt%2Cde';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '558aea09d6msh9263c542b38d770p18aa5ajsn7d117b900c9a',
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
  "Snow": "Neige",
  "Fog": "Brouillard",
  "Haze": "Brume"
};


function App() {
  
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState ({});


  useEffect(() => {
    if (typeof weather.weather !== "undefined") {
      // Supprime toutes les classes de condition météorologique existantes
      document.body.classList.remove("clouds", "rain", "thunderstorm", "clear", "mist", "snow", "fog", "haze");
      
      // Ajoute la nouvelle classe basée sur la condition météorologique actuelle
      document.body.classList.add(weather.weather[0].main.toLowerCase());
    }
  }, [weather]);


  const [errorMsg, setErrorMsg] = useState('');

  function search(evt) {
    if (evt.key === "Enter") {
      fetch(`${api.base}?q=${query.trim()}&units=metric&APPID=${api.key}`)
        .then(res => res.json())
        .then(result => {
          if (result.cod === "404") { // Vérifiez le code de réponse de l'API
            setErrorMsg("Aucune ville n'a été trouvée..");
            setWeather({});
          } else {
            setWeather(result);
            setErrorMsg(''); // Réinitialisez le message d'erreur si une ville est trouvée
          }
          setQuery('');
        })
        .catch(error => {
          // Gérer les erreurs de requête ici
          setErrorMsg("Erreur lors de la recherche de la ville");
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


  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [locationError, setLocationError] = useState(null);
  const [isGeoLocationActive, setIsGeoLocationActive] = useState(false);


  const toggleGeoLocation = () => {
    if (!isGeoLocationActive) {
      // Si la géolocalisation n'est pas active, activez-la et obtenez la position
      getLocation(setLocation, setLocationError, setWeather, setErrorMsg, api);
    } else {
      // Si la géolocalisation est active, désactivez-la
      setLocation({ latitude: null, longitude: null });
      setLocationError(null);
      setWeather({});
      // Vous pourriez également réinitialiser l'état de la météo ici si nécessaire
    }
    setIsGeoLocationActive(!isGeoLocationActive);
  };
  


  const isWeatherEmpty = !weather.main;
  return (
    
    <div className={`app ${(!weather.main || typeof weather.main === "undefined") ? 'base' : ''}`}>
    
       
      <main>
        <div className="search-box">
          <input 
            type="text"
            className="search-bar"
            placeholder="Rechercher une ville"
            onChange={e => setQuery(e.target.value)}
            value={query}
            onKeyPress={search}
          />
          
          <button onClick={toggleGeoLocation}>
          {isGeoLocationActive ? "Arrêter la géo-localisation" : "Me localiser"}
        </button>
        </div>
        

        {errorMsg && <p className="error-message">{errorMsg}</p>}
        {isWeatherEmpty && (
        <div className="centered-container">
        <Card 
          title="Rapid Météo" 
          description="Obtenez la météo d'une ville grâce à la barre de recherche en haut de l'écran." 
        />
      </div>
      )}
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
        {/* {locationError && <p className="error-message">{locationError}</p>}
        {location.latitude && location.longitude && (
        <p className="location-coords">
          Latitude: {location.latitude}, Longitude: {location.longitude}
        </p>
      )} */}
      </main>
    </div>
  );
}

export default App;
