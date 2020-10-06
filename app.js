
const key = 'lJv1VKjEIAG5uHkz68hsktmQeP0i5Abx';
const form = document.querySelector('.form-control');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    const city = form.city.value.trim();
    Send(city, Receive);
    form.reset();
});

function Send(city, callback) {
    const url = 'http://dataservice.accuweather.com/locations/v1/cities/search';
    const query = `?apikey=${key}&q=${city}`;
    const request = new XMLHttpRequest();
    request.open('GET', url + query, true);
    request.onload = function () {
        const data = JSON.parse(request.responseText);
        const loc_key = data[0].Key;
        console.log(loc_key);
        callback(loc_key, city, populate);
    };
    request.send();
}

function Receive(loc_key,city,callback) {
    const forecast = `http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/${loc_key}`;
    const fetch_query = `?apikey=${key}`;
    const frcast = new XMLHttpRequest();
    frcast.open('GET', forecast + fetch_query, true);
    frcast.onload = function () {
        const jdata = JSON.parse(frcast.responseText);
        console.log(jdata);
        callback(city,jdata);
    };
    frcast.send();
}

function populate(city,jdata) {
    let tem = jdata[0].Temperature.Value;
    tem = Math.round((tem - 32) * (5 / 9));
    const timet = jdata[0].IsDaylight;
    const ic = jdata[0].WeatherIcon;
    document.querySelector('.icon').innerHTML=`<img src="icons/${ic}.png">`;
    console.log(timet);
    if (timet) {
        document.querySelector('.card img').setAttribute('src', `https://source.unsplash.com/400x300/?${city},sunlight`);
    }
    else {
        document.querySelector('.card img').setAttribute('src', `https://source.unsplash.com/400x300/?${city},night`);
    }
    document.querySelector('.card').classList.add('show');
    document.querySelector('.temper').querySelector('span').innerText = tem;
    document.querySelector('.card-details h4').innerText = city;

}