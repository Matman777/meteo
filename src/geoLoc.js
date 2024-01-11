export const getLocation = (setLocation, setError, setWeather, api) => {
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
            setWeather(result);
          });
      }, 
      () => {
        setError('Unable to retrieve your location');
      }
    );
  }
};
