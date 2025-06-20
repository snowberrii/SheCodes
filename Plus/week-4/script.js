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
let hour = now.getHours();
let minute = (now.getMinutes() < 10 ? "0" : "") + now.getMinutes();

let currentTime = document.querySelector(".current-time");
currentTime.innerHTML = `${day}, ${month} ${date} | ${hour}:${minute}`;

function search(event) {
  event.preventDefault();
  let searchCity = document.querySelector(".search-city-input");
  let changeCity = document.querySelector("h1");
  changeCity.innerHTML = `${searchCity.value}`;
}

let searchForm = document.querySelector(".search-form");
searchForm.addEventListener("submit", search);
