export const getLocation = (setLocation, setError, setWeather, setErrorMsg, api) => {
  if (!navigator.geolocation) {
    setError('Geolocation is not supported by your browser');
  } else {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        fetch(`${api.base}?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&APPID=${api.key}`)
          .then(res => res.json())
          .then(result => {
            if (result.cod === "404") {
              setErrorMsg("Aucune ville trouvée");
              setWeather({});
            } else {
              setWeather(result);
              setErrorMsg(''); // Réinitialiser le message d'erreur
            }
          });
      }, 
      () => {
        setError('Unable to retrieve your location');
      }
    );
  }
};
