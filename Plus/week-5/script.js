let currentFahrenheitTemp = null;
const savedUnit = localStorage.getItem("unit");
let currentUnit = savedUnit ? savedUnit : "F";
let forecastData = []; // to store the full forecast response

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

function showCurrentTime(response) {
  const localTime = new Date(response.data.time * 1000); // Convert UNIX timestamp to JS Date

  const day = days[localTime.getDay()];
  const month = months[localTime.getMonth()];
  const date = localTime.getDate();
  const hour = localTime.getHours().toString().padStart(2, "0");
  const minute = localTime.getMinutes().toString().padStart(2, "0");

  const currentTime = document.querySelector(".current-time");
  currentTime.innerHTML = `${day}, ${month} ${date} | ${hour}:${minute}`;
}

function toCelsius(fahrenheit) {
  return Math.round(((fahrenheit - 32) * 5) / 9);
}

function renderTemperature(temp, unit) {
  currentUnit = unit; // update global unit
  localStorage.setItem("unit", unit); // save user preference

  const tempElement = document.querySelector(".current-temp");
  const isFahrenheit = unit === "F";
  const displayTemp = isFahrenheit ? temp : toCelsius(temp);

  tempElement.innerHTML = `
    ${displayTemp}
    <div class="unit-toggle">
      <a href="#" id="fahrenheit-link" class="${
        isFahrenheit ? "active" : ""
      }">°F</a>|<a href="#" id="celsius-link" class="${
        !isFahrenheit ? "active" : ""
      }">°C</a>
    </div>
  `;

  document
    .querySelector("#fahrenheit-link")
    .addEventListener("click", displayFahrenheitTemp);
  document
    .querySelector("#celsius-link")
    .addEventListener("click", displayCelsiusTemp);

  displayForecast(forecastData); // re-render forecast in correct unit
}


function displayCelsiusTemp(event) {
  event.preventDefault();
  renderTemperature(currentFahrenheitTemp, "C");
}

function displayFahrenheitTemp(event) {
  event.preventDefault();
  renderTemperature(currentFahrenheitTemp, "F");
}

function showCurrentTemp(response) {
  currentFahrenheitTemp = Math.round(response.data.temperature.current);
  renderTemperature(currentFahrenheitTemp, currentUnit); //use saved unit
}

function showCondition(response) {
  let description = response.data.condition.description;
  let condition = document.querySelector(".current-condition");
  condition.textContent = formatName(description);
}

function showWeatherIcon(response) {
  let weatherIcon = document.querySelector(".current-weather-icon");
  weatherIcon.innerHTML = `<img
      src="${response.data.condition.icon_url}"
      class="weather-icon"/>`;
}

function showHumidity(response) {
  let humidity = document.querySelector(".humidity");
  humidity.textContent = `${response.data.temperature.humidity}%`;
}

function showWindSpeed(response) {
  let windSpeed = document.querySelector(".wind");
  windSpeed.textContent = `${response.data.wind.speed}km/h`;
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
  forecastData = response; // save for toggling

  const forecastContainer = document.querySelector(".forecast-container");
  forecastContainer.innerHTML = "";

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  response.data.daily.slice(1, 6).forEach((day) => {
    const date = new Date(day.time * 1000);
    const dayName = daysOfWeek[date.getDay()];

    const icon = day.condition.icon_url;
    let high = day.temperature.maximum;
    let low = day.temperature.minimum;

    if (currentUnit === "C") {
      high = toCelsius(high);
      low = toCelsius(low);
    } else {
      high = Math.round(high);
      low = Math.round(low);
    }

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


function updateCurrentWeather(response) {
  showCurrentTime(response);
  showCurrentTemp(response);
  showCondition(response);
  showWeatherIcon(response);
  showHumidity(response);
  showWindSpeed(response);
}

// Reusable function to get weather data
function fetchWeather(city) {
  const formattedCityName = formatName(city);
  const apiKey = config.apiKey;
  const apiUrl = `https://api.shecodes.io/weather/v1/current?query=${formattedCityName}&key=${apiKey}&units=imperial`;
  const forecastApiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${formattedCityName}&key=${apiKey}&units=imperial`;

  let changeCity = document.querySelector("h1");
  changeCity.innerHTML = formattedCityName;

  axios.get(apiUrl).then(updateCurrentWeather);
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
