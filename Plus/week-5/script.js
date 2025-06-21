let now = new Date();

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let months = [
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

let day = days[now.getDay()];
let month = months[now.getMonth()];
let date = now.getDate();
let hour = (now.getHours() < 10 ? "0" : "") + now.getHours();
let minute = (now.getMinutes() < 10 ? "0" : "") + now.getMinutes();

let currentTime = document.querySelector(".current-time");
currentTime.innerHTML = `${day}, ${month} ${date} | ${hour}:${minute}`;

//change temperature to realtime
function showCurrentTemp(response) {
  let currentTemp = Math.round(response.data.temperature.current);
  let h2 = document.querySelector(".current-temp");
  h2.innerHTML = `${currentTemp} <span class="smaller">&deg;F</span> `;
}

function formatName(text) {
  if (!text) return "";
  return text
    .trim()
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) //cap the first letter of each word
    .join(" "); //puts it all back together with spaces
}

function showCondition(response) {
  let description = response.data.condition.description;
  let condition = document.querySelector(".current-condition");
  condition.innerHTML = formatName(description);
}

function search(event) {
  event.preventDefault();
  let searchCity = document.querySelector(".search-city-input");
  let changeCity = document.querySelector("h1");
  let city = searchCity.value;
  let formattedCityName = formatName(city);

  let apiKey = ""; // your api key here
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${formattedCityName}&key=${apiKey}&units=imperial`;

  changeCity.innerHTML = `${formattedCityName}`;

  axios.get(apiUrl).then((response) => {
    showCurrentTemp(response);
    showCondition(response);
  });
}

let searchForm = document.querySelector(".search-form");
searchForm.addEventListener("submit", search);
