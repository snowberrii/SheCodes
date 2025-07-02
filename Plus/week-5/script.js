function showCurrentTime(response) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const localTime = new Date(response.data.time * 1000); // Convert UNIX timestamp to JS Date

  const day = days[localTime.getDay()];
  const month = months[localTime.getMonth()];
  const date = localTime.getDate();
  const hour = localTime.getHours().toString().padStart(2, "0");
  const minute = localTime.getMinutes().toString().padStart(2, "0");

  const currentTime = document.querySelector(".current-time");
  currentTime.innerHTML = `${day}, ${month} ${date} | ${hour}:${minute}`;
}

function showCurrentTemp(response) {
  let currentTemp = Math.round(response.data.temperature.current);
  let h2 = document.querySelector(".current-temp");
  h2.innerHTML = `${currentTemp} <span class="smaller">&deg;F</span> `;
}

function showCondition(response) {
  let description = response.data.condition.description;
  let condition = document.querySelector(".current-condition");
  condition.innerHTML = formatName(description);
}

function showWeatherIcon(response) {
  let weatherIcon = document.querySelector(".current-weather-icon");
  weatherIcon.innerHTML = `<img
      src="${response.data.condition.icon_url}"
      class="weather-icon"/>`;
}

function showHumidity(response) {
  let humidity = document.querySelector(".humidity");
  humidity.innerHTML = `${response.data.temperature.humidity}%`;
}

function showWindSpeed(response) {
  let windSpeed = document.querySelector(".wind");
  windSpeed.innerHTML = `${response.data.wind.speed}km/h`;
}

//format text
function formatName(text) {
  if (!text) return "";
  return text
    .trim()
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) //cap the first letter of each word
    .join(" "); //puts it all back together with spaces
}

function displayForecast(response) {
  const forecastContainer = document.querySelector(".forecast-container");
  forecastContainer.innerHTML = ""; // clear old forecast

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  response.data.daily.slice(1, 6).forEach((day) => {
    const date = new Date(day.time * 1000);
    const dayName = daysOfWeek[date.getDay()];

    const icon = day.condition.icon_url;
    const low = Math.round(day.temperature.minimum);
    const high = Math.round(day.temperature.maximum);

    const forecastHTML = `
      <div class="forecast-day">
        <div class="forecast-date">${dayName}</div>
        <div class="forecast-icon">
          <img src="${icon}" alt="icon" class="forecast-img" />
        </div>
        <div class="forecast-temps">
        <div class="forecast-high-temp">${high}&deg;</div>
        <div class="forecast-low-temp">${low}&deg;</div>
        </div>
      </div>
    `;

    forecastContainer.innerHTML += forecastHTML;
  });
}


// Reusable function to get weather data
function fetchWeather(city) {
  const formattedCityName = formatName(city);
  const apiKey = config.apiKey;
  const apiUrl = `https://api.shecodes.io/weather/v1/current?query=${formattedCityName}&key=${apiKey}&units=imperial`;
  const forecastApiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${formattedCityName}&key=${apiKey}&units=imperial`;

  let changeCity = document.querySelector("h1");
  changeCity.innerHTML = formattedCityName;

  

  axios.get(apiUrl).then((response) => {
    showCurrentTime(response);
    showCurrentTemp(response);
    showCondition(response);
    showWeatherIcon(response);
    showHumidity(response);
    showWindSpeed(response);
  });

  axios.get(forecastApiUrl).then(displayForecast);
  
}

// Handle form submission
function search(event) {
  event.preventDefault();
  let searchCity = document.querySelector(".search-city-input").value;
  fetchWeather(searchCity);
}

let searchForm = document.querySelector(".search-form");
searchForm.addEventListener("submit", search);

// Load default city on page load
fetchWeather("Seattle");