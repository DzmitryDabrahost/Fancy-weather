const search = document.querySelector('input');
const form = document.getElementById('form');
const celsius = document.querySelector('.button__cel');
const fahrenheit = document.querySelector('.button__far');
const dateBlock = document.querySelector('.date__today');
const timeBlock = document.querySelector('.time__today');
const select = document.querySelector('select').value;

const vocabulary = {
  wind: 'wind:',
  latitude: 'latitude:',
  longitude: 'longitude:',
  feels: 'feels like:',
  humidity: 'humidity:',
  timeLocal: 'en-GB'
}

function getTime(zone) {
  const date = new Date();
  const tomorrow = new Date(date.getTime() + (24 * 60 * 60 * 1000));
  const tomorrow2 = new Date(date.getTime() + (48 * 60 * 60 * 1000));
  const tomorrow3 = new Date(date.getTime() + (72 * 60 * 60 * 1000));
  const tomorrowDayName = new Intl.DateTimeFormat(vocabulary.timeLocal, { weekday: 'long' }).format(tomorrow);
  const tomorrowDayName2 = new Intl.DateTimeFormat(vocabulary.timeLocal, { weekday: 'long' }).format(tomorrow2);
  const tomorrowDayName3 = new Intl.DateTimeFormat(vocabulary.timeLocal, { weekday: 'long' }).format(tomorrow3);
  dateBlock.textContent = date.toLocaleString(vocabulary.timeLocal, {weekday: 'long', month: 'long', day: 'numeric'}).replace(/,/, '');
  timeBlock.textContent = date.toLocaleString(vocabulary.timeLocal, {hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false, timeZone: zone});
  document.querySelector('.weather__tomorrow__nameday').textContent = tomorrowDayName;
  document.querySelector('.weather__tomorrow2__nameday').textContent = tomorrowDayName2;
  document.querySelector('.weather__tomorrow3__nameday').textContent = tomorrowDayName3;
}

setInterval(getTime, 1000);

function locationdata(data) {
  const location = {
    lang: select,
    country: data.country,
    city: data.city,
    timezone: data.timezone,
    longitude: data.loc.slice(8),
    latitude: data.loc.slice(0, 7)
  }
  getTime(location.timezone);
  changeSelect(location.city, location.lang);
  getWeather(location.city, location.lang);
  getLinkToImage(location.city);
  showMap(location.longitude, location.latitude);
  buttonHandler(location.city, location.lang);

  const lonCoords = location.longitude.split('.');
  const latCoords = location.latitude.split('.');
  const longitude = `${lonCoords[0]}°${lonCoords[1]}'`;
  const latitude = `${latCoords[0]}°${latCoords[1]}'`;
  document.querySelector('.weather__city').innerHTML = `${location.city}, ${location.country}`;
  document.querySelector('.location__longitude').innerText = `${vocabulary.longitude}${longitude}`;
  document.querySelector('.location__latitude').innerText = `${vocabulary.latitude}${latitude}`;
}

function newLocationData(data) {
  const location = {
    lang: select,
    country: data.results[0].components.country,
    city: data.results[0].components.state,
    timezone: data.results[0].annotations.timezone.name,
    formatted: data.results[0].formatted,
    longitude: String(data.results[0].geometry.lng),
    latitude: String(data.results[0].geometry.lat)
  }
  getTime(location.timezone);
  changeSelect(location.city, location.lang);
  getWeather(location.city, location.lang);
  getLinkToImage(location.city);
  document.getElementById('map').innerHTML = '';
  showMap(location.longitude, location.latitude);
  buttonHandler(location.city, location.lang);

  const lonCoords = location.longitude.split('.');
  const latCoords = location.latitude.split('.');
  const longitude = `${lonCoords[0]}°${lonCoords[1]}'`;
  const latitude = `${latCoords[0]}°${latCoords[1]}'`;
  document.querySelector('.weather__city').innerHTML = `${location.formatted}`;
  document.querySelector('.location__longitude').innerText = `${vocabulary.longitude}${longitude}`;
  document.querySelector('.location__latitude').innerText = `${vocabulary.latitude}${latitude}`;
}

const showMap = (longitude, latitude) => {
  mapboxgl.accessToken = 'pk.eyJ1IjoiZHptaXRyeWRhYnJhaG9zdCIsImEiOiJja2F0dDVtMDcxMzA0MnhxZnB5NDQ2bzY3In0.-ZaWFZCPWov_ieQcJJ8j7g';
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [longitude, latitude],
    zoom: 11,
  });
 
  const marker = new mapboxgl.Marker()
  .setLngLat([`${longitude}`, `${latitude}`])
  .addTo(map);
}

function linkToImage(data) {
  const img = data.urls.regular;
  document.body.style.backgroundImage = `url(${img})`;
}

function getWeather(city, lang) {
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&days=4&units=N&lang=${lang}&key=442914b5bf5643558eff64aaad16d208`;
  fetch(url)
  .then((res) => res.json())
  .then((data) => {
    const tempTodayC = data.data[0].temp.toFixed();
    const tempTomorroyC = data.data[1].temp.toFixed();
    const tempTomorroy2C = data.data[2].temp.toFixed();
    const tempTomorroy3C = data.data[3].temp.toFixed();
    const tempFeelC = data.data[0].temp.toFixed();
    const tempTodayF = (tempTodayC * 1.8 + 32).toFixed();
    const tempTomorroyF = (tempTomorroyC * 1.8 + 32).toFixed();
    const tempTomorroy2F = (tempTomorroy2C * 1.8 + 32).toFixed();
    const tempTomorroy3F = (tempTomorroy3C * 1.8 + 32).toFixed();
    const tempFeelF = (tempFeelC * 1.8 + 32).toFixed();
    const activeButton = document.querySelector('.active');

    if (activeButton.innerText === 'C0') {
      setTempCel(tempTodayC, tempTomorroyC, tempTomorroy2C, tempTomorroy3C, tempFeelC);
    } else {
      setTempFar(tempTodayF, tempTomorroyF, tempTomorroy2F, tempTomorroy3F, tempFeelF);
    }

    const imgToday = `<img src="https://www.weatherbit.io/static/img/icons/${data.data[0].weather.icon}.png">`;
    const imgTomorrow = `<img src="https://www.weatherbit.io/static/img/icons/${data.data[1].weather.icon}.png">`;
    const imgTomorrow2 = `<img src="https://www.weatherbit.io/static/img/icons/${data.data[2].weather.icon}.png">`;
    const imgTomorrow3 = `<img src="https://www.weatherbit.io/static/img/icons/${data.data[3].weather.icon}.png">`;
    
    document.querySelector('.wind').textContent = `${vocabulary.wind}${data.data[0].wind_spd.toFixed(1)} m/s`;
    document.querySelector('.overcast').textContent = `${data.data[0].weather.description}`;
    document.querySelector('.weather__data__image').innerHTML = `${imgToday}`;
    document.querySelector('.weather__tomorrow__image').innerHTML = `${imgTomorrow}`;
    document.querySelector('.weather__tomorrow2__image').innerHTML = `${imgTomorrow2}`;
    document.querySelector('.weather__tomorrow3__image').innerHTML = `${imgTomorrow3}`;
    document.querySelector('.humidity').textContent = `${vocabulary.humidity} ${data.data[0].rh}%`;
  });
}

function translate(lang) {
  if (lang === 'En') {
    vocabulary.wind = 'wind:',
    vocabulary.latitude = 'latitude:',
    vocabulary.longitude = 'longitude:',
    vocabulary.feels = 'feels like:',
    vocabulary.humidity = 'humidity:',
    vocabulary.timeLocal = 'en-GB'
  }
  else if (lang === 'Ru') {
    vocabulary.wind = 'ветер:',
    vocabulary.latitude = 'Широта:',
    vocabulary.longitude = 'Долгота:',
    vocabulary.feels = 'Ощущается как:',
    vocabulary.humidity = 'Влажность:',
    vocabulary.timeLocal = 'ru-RU'
  }
  else if (lang === 'Be') {
    vocabulary.wind = 'вецер:',
    vocabulary.latitude = 'Шырата:',
    vocabulary.longitude = 'Даугата:',
    vocabulary.feels = 'Адчуваецца як:',
    vocabulary.humidity = 'Вiльготнасць:',
    vocabulary.timeLocal = 'be-BY'
  }
  return vocabulary;
}

function setTempCel(tempTodayC, tempTomorroyC, tempTomorroy2C, tempTomorroy3C, tempFeelC) {
  document.querySelector('.weather__data__temp').textContent = `${tempTodayC}°`;
  document.querySelector('.weather__tomorrow__grad').textContent = `${tempTomorroyC}°`;
  document.querySelector('.weather__tomorrow2__grad').textContent = `${tempTomorroy2C}°`;
  document.querySelector('.weather__tomorrow3__grad').textContent = `${tempTomorroy3C}°`;
  document.querySelector('.feelslike').textContent = `${vocabulary.feels}${tempFeelC}°`;
}

function setTempFar(tempTodayF, tempTomorroyF, tempTomorroy2F, tempTomorroy3F, tempFeelF) {
  document.querySelector('.weather__data__temp').textContent = `${tempTodayF}°`;
  document.querySelector('.weather__tomorrow__grad').textContent = `${tempTomorroyF}°`;
  document.querySelector('.weather__tomorrow2__grad').textContent = `${tempTomorroy2F}°`;
  document.querySelector('.weather__tomorrow3__grad').textContent = `${tempTomorroy3F}°`;
  document.querySelector('.feelslike').textContent = `${vocabulary.feels}${tempFeelF}°`;
}

async function getLocationdata() {
  const url = 'https://ipinfo.io/json?token=577a1bd827d7cc';
  const res = await fetch(url);
  const data = await res.json();
  return locationdata(data);
}

async function getLinkToImage(city) {
  try {
    const urlImage = `https://api.unsplash.com/photos/random?orientation=landscape&per_page=1&query={${city}, cities, weather}&client_id=Wi36Hz5XJ-gNE6rzKvnKepYNbdYM41UqFOllDlNT3ns`;
    const res = await fetch(urlImage);
    const data = await res.json();
    return linkToImage(data);
  }
  catch {
    document.body.style.backgroundImage = `url(images/city.jpg)`;
    console.log('загрузилась заглушка, лимит unsplash исчерпан, через час всё снова заработает')
  }
}

async function getDataToSearch() {
  try {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${search.value}&key=c06b01a42aad437f8ebd864a00ae8f77`;
    const res = await fetch(url);
    const data = await res.json();
    return newLocationData(data);
  }
  catch {
    alert('responce incorrect, enter correct city');
  }
}

function buttonHandler(city, lang) {
  document.querySelector('.header__button__temp').addEventListener(('click'), (e) => {
    let clicked = e.target;
    if (clicked.classList.contains('buttons')) {
      let buttons = document.querySelectorAll('.buttons');
      buttons.forEach(btn => {
        btn.classList.remove('active');
        clicked.classList.add('active');
      });
    }
    getWeather(city, lang);
  })
}

function changeSelect(city, lang) {
  document.querySelector('select').addEventListener(('change'), (e) => {
    const value = e.target.value;
    lang = value;
    translate(lang);
    getWeather(city, lang);
  });
}

const backgroundChange = () => {
  document.querySelector('.button__change').addEventListener(('click'), (e) => {
    getLinkToImage();
  })
}

form.addEventListener(('submit'), (e) => {
  e.preventDefault();
  getDataToSearch();
});

window.onload = function() {
  getLocationdata();
  backgroundChange();
}
