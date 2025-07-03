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
  currentUnit = unit;
  localStorage.setItem("unit", unit);

  const tempElement = document.querySelector(".current-temp");
  tempElement.innerHTML = "";

  const isFahrenheit = unit === "F";
  const displayTemp = isFahrenheit ? temp : toCelsius(temp);

  const tempValue = document.createTextNode(displayTemp + " ");

  const toggleDiv = document.createElement("div");
  toggleDiv.className = "unit-toggle";

  const fahrenheitLink = document.createElement("a");
  fahrenheitLink.href = "#";
  fahrenheitLink.id = "fahrenheit-link";
  fahrenheitLink.textContent = "°F";
  if (isFahrenheit) fahrenheitLink.classList.add("active");

  const celsiusLink = document.createElement("a");
  celsiusLink.href = "#";
  celsiusLink.id = "celsius-link";
  celsiusLink.textContent = "°C";
  if (!isFahrenheit) celsiusLink.classList.add("active");

  const separator = document.createTextNode("|");

  toggleDiv.appendChild(fahrenheitLink);
  toggleDiv.appendChild(separator);
  toggleDiv.appendChild(celsiusLink);

  tempElement.appendChild(tempValue);
  tempElement.appendChild(toggleDiv);

  fahrenheitLink.addEventListener("click", displayFahrenheitTemp);
  celsiusLink.addEventListener("click", displayCelsiusTemp);

  // 🔁 Re-render forecast when unit changes
  displayForecast(forecastData);
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
  // Normalize the input and ensure structure is consistent
  const data = response.data ? response.data : response;

  // Save it in correct format: always with `.daily`
  forecastData = { daily: data.daily };

  const forecastContainer = document.querySelector(".forecast-container");
  forecastContainer.innerHTML = "";

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  data.daily.slice(1, 6).forEach((day) => {
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

    const forecastDay = document.createElement("div");
    forecastDay.classList.add("forecast-day");

    const dateDiv = document.createElement("div");
    dateDiv.classList.add("forecast-date");
    dateDiv.textContent = dayName;

    const iconDiv = document.createElement("div");
    iconDiv.classList.add("forecast-icon");
    const img = document.createElement("img");
    img.src = icon;
    img.alt = "icon";
    img.className = "forecast-img";
    iconDiv.appendChild(img);

    const tempsDiv = document.createElement("div");
    tempsDiv.classList.add("forecast-temps");

    const highDiv = document.createElement("div");
    highDiv.classList.add("forecast-high-temp");
    highDiv.innerHTML = `${high}&deg;`;

    const lowDiv = document.createElement("div");
    lowDiv.classList.add("forecast-low-temp");
    lowDiv.innerHTML = `${low}&deg;`;

    tempsDiv.appendChild(highDiv);
    tempsDiv.appendChild(lowDiv);

    forecastDay.appendChild(dateDiv);
    forecastDay.appendChild(iconDiv);
    forecastDay.appendChild(tempsDiv);

    forecastContainer.appendChild(forecastDay);
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
