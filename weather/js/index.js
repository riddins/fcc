if (navigator.geolocation){
  console.log('geolocation supported');
}

window.onload = function(){
  var startPos;
  var lat;
  var lon;
  var geoSuccess = function(position){
    startPos = position;
    lat = startPos.coords.latitude;
    lon = startPos.coords.longitude;
    console.log('latitude: ' + lat);
    console.log('longitude: ' + lon);
    getWeather(lat, lon);
  };
  var geoError = function(err){
    console.log('error occured:  code ' + err.code);
  };
  navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
  $("#btnUnits").on("click", toggleButton);
};


function toggleButton(){
  var units = $("#btnUnits").text();
  var deg = $("#mainTemp").text().replace(/\D/g, '');
  var degMin = $("#mainTempMin").text().replace(/\D/g, '');
  var degMax = $("#mainTempMax").text().replace(/\D/g, '');
 
  switch(units){
    case 'Fahrenheit':
      unitText = 'Celsius';
      $("#mainTemp").text(tempToString(toFahrenheit(deg), ' F'));
      $("#mainTempMin").text(tempToString(toFahrenheit(degMin), ' F'));
      $("#mainTempMax").text(tempToString(toFahrenheit(degMax), ' F'));
      break;
    case 'Celsius':
      unitText = 'Fahrenheit';
      $("#mainTemp").text(tempToString(toCelsius(deg), ' C'));
      $("#mainTempMin").text(tempToString(toCelsius(degMin), ' C'));
      $("#mainTempMax").text(tempToString(toCelsius(degMax), ' C'));
      break;
  };  
  $("#btnUnits").text(unitText);
};

function tempToString(deg, units){
  return Math.round(deg) + String.fromCharCode(176) + units;
};

function toFahrenheit(deg){
  return deg * (9/5) + 32;
};

function toCelsius(deg){
  return (deg - 32) * (5/9)
};

function getWeather(lat, lon, units='metric'){
  //var units = 'imperial'
  //var units = 'metric'
  //fcc-weather-api does not accept units parameter
  var url = 'https://fcc-weather-api.glitch.me/api/current?lat=' + lat + '&lon=' + lon + '&units=' + units;
  $.getJSON(url).done(parseWeather);
  var unitText;
  switch(units){
    case 'imperial':
      unitText = 'Celsius';
      break;
    case 'metric':
      unitText = 'Fahrenheit';
      break;
  }; 
  $("#btnUnits").text(unitText);
};

function parseWeather(weather){
  $("#dt").text(Date(weather.dt));
  $("#cityName").text(weather.name);
  $("#sysSunrise").text(Date(weather.sys.sunrise));
  $("#sysSunset").text(Date(weather.sys.sunset));
  $("#weatherMain").text(weather.weather[0].main);
  $("#weatherDesc").text(weather.weather[0].description);
  $("#weatherIcon").attr('src', weather.weather[0].icon);
  $("#mainTemp").text(Math.round(weather.main.temp) + String.fromCharCode(176) + ' C');
  $("#mainHumidity").text(weather.main.humidity);
  $("#mainPressure").text(weather.main.pressure);
  $("#mainTempMin").text(Math.round(weather.main.temp_min) + String.fromCharCode(176) + ' C');
  $("#mainTempMax").text(Math.round(weather.main.temp_max) + String.fromCharCode(176) + ' C');
  $("#windSpeed").text(weather.wind.speed);
  $("#windDeg").text(weather.wind.deg);
  //$("#rain").text(weather.rain['3h']);
  $("#cloudsAll").text(weather.clouds.all);
};
