const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const latInput = document.querySelector(".latInput");
const lonInput = document.querySelector(".lonInput");
const card = document.querySelector(".card");

const apiKey = "f3b01bc3e1075339f7ffd33771bcec9c";

let userPosition = null;

const success = (position) => {
  console.log(position);
  userPosition = position;
};

const fail = (err) => {
  console.log(err);
};

navigator.geolocation.getCurrentPosition(success, fail);
weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = cityInput.value.trim();
  const lat =
    latInput.value.trim() || (userPosition && userPosition.coords.latitude);
  const lon =
    lonInput.value.trim() || (userPosition && userPosition.coords.longitude);

  try {
    let weatherData;

    if (city) {
      weatherData = await getWeatherDataByCity(city);
    } else if (lat && lon) {
      weatherData = await getWeatherDataByCoords(lat, lon);
    } else {
      return displayError("Please enter a valid cordinates");
    }

    if (weatherData.cod !== 200) {
      return displayError(weatherData.message || "Data not found.");
    }

    displayWeatherInfo(weatherData);
  } catch (err) {
    console.error("Error:", err);
    displayError("Something went wrong. Check console.");
  }
});

async function getWeatherDataByCity(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  const response = await fetch(apiUrl);
  return await response.json();
}

async function getWeatherDataByCoords(lat, lon) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  const response = await fetch(apiUrl);
  return await response.json();
}

function displayWeatherInfo(data) {
  const city = data.name;
  const temp = data.main.temp;
  const humidity = data.main.humidity;
  const description = data.weather[0].description;
  const id = data.weather[0].id;

  card.innerHTML = "";

  const cityDisplay = document.createElement("h1");
  const tempDisplay = document.createElement("p");
  const humidityDisplay = document.createElement("p");
  const descDisplay = document.createElement("p");
  const weatherEmoji = document.createElement("p");

  cityDisplay.textContent = city;
  tempDisplay.textContent = `${Math.floor(temp - 273.15)}°`;
  humidityDisplay.textContent = `Humidity: ${humidity}%`;
  descDisplay.textContent = description;
  weatherEmoji.textContent = getWeatherEmoji(id);

  cityDisplay.classList.add("cityDisplay");
  tempDisplay.classList.add("tempDisplay");
  humidityDisplay.classList.add("humidityDisplay");
  descDisplay.classList.add("descDisplay");
  weatherEmoji.classList.add("weatherEmoji");

  card.appendChild(cityDisplay);
  card.appendChild(tempDisplay);
  card.appendChild(humidityDisplay);
  card.appendChild(descDisplay);
  card.appendChild(weatherEmoji);

  card.style.display = "flex";
}

function getWeatherEmoji(weatherId) {
  switch (true) {
    case weatherId >= 200 && weatherId < 300:
      return "⛈️";
    case weatherId >= 300 && weatherId < 400:
      return "🌧️";
    case weatherId >= 500 && weatherId < 600:
      return "🌦️";
    case weatherId >= 600 && weatherId < 700:
      return "🌨️";
    case weatherId >= 700 && weatherId < 800:
      return "🌫️";
    case weatherId === 800:
      return "☀️";
    case weatherId >= 801 && weatherId < 810:
      return "☁️";
    default:
      return "🌈";
  }
}

function displayError(message) {
  card.innerHTML = `<p class="errorDisplay">${message}</p>`;
  card.style.display = "flex";
}
