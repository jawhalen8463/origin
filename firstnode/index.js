/**
 * Created by james on 1/15/2017.
 */
// http://openweathermap.org/current
// http://openweathermap.org/weather-conditions

//navigator.geolocation.getCurrentPosition(success, error);

document.getElementById("city").value = "New York, NY";
load();
loadingMessageDisplayed = 0;

function updateLoadingMessage() {
    if (loadingMessageDisplayed) {
        document.getElementById("loading").innerHTML = "";
    }
    else {
        document.getElementById("loading").innerHTML = "loading...";
        loadingMessageDisplayed = 1;
    }
}

function load() {
    let city = document.getElementById("city").value;

    loadingMessageDisplayed = 0;
    updateLoadingMessage();

    let appid = '549d15f9e830235d97fa32c49d077d31';
    let weatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${appid}&units=imperial`;
    let fiveDayUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${appid}&units=imperial`;

    console.log("1");

    let weatherRequest = new XMLHttpRequest();
    weatherRequest.onload = weatherSuccess;
    weatherRequest.onerror = failure;
    weatherRequest.open('get', weatherUrl, true);
    weatherRequest.send();

    console.log("2");

    let fiveDayRequest = new XMLHttpRequest();
    fiveDayRequest.onload = fiveDaySuccess;
    fiveDayRequest.onerror = failure;
    fiveDayRequest.open('get', fiveDayUrl, true);
    fiveDayRequest.send();

    console.log("3");

    // code

    function weatherSuccess() {
        let data = JSON.parse(this.responseText);
        console.log("current weather", data);
        updateLoadingMessage();
        document.getElementById("currentResults").innerHTML = buildCurrentSummary(data);
    }

    function fiveDaySuccess() {
        let data = JSON.parse(this.responseText);
        console.log("five day", data);
        updateLoadingMessage();
        document.getElementById("5dayResults").innerHTML = buildForecastTable(data);
    }

    function failure(error) {
        showResults("<h2 style='color:red'>Oh no, something bad happened!</h2>");
        console.error(error);
    }
}

function buildCurrentSummary(current) {
    let weather = current.weather[0];
    let result = `
        <h2>Current weather in ${current.name}</h2>
        <p>
        <img src="http://openweathermap.org/img/w/${weather.icon}.png"/>
        ${weather.description}
        </p>
        <p>${Date(current.dt)}</p>
        <p>${current.main.temp}°F, ${current.main.humidity}% humidity</p>
        <p>Wind: ${current.wind.speed} miles/hr</p>
        <p>${current.clouds.all}% cloudy</p>
    `;
    return result;
}

function buildForecastTable(fiveDay) {
    let result = `
      <h2>5 day forecast</h2>
      <table><tbody>`;

    let previous;
    for (let record of fiveDay.list) {
        let weather = record.weather[0];
        let time = record.dt_txt.substring(11, 16);
        let newDay = !previous || record.dt_txt.substring(0, 10) !== previous.dt_txt.substring(0, 10);
        if (newDay) {
            result += '<tr><td colspan=4><h3>${record.dt_txt.substring(0, 10)}</h3></td></tr>';
        }
        result +=
            `<tr>
        <td>${time}</td>
        <td><img src="http://openweathermap.org/img/w/${weather.icon}.png"/></td>
        <td>${record.main.temp}</td>
        <td>${weather.description}</td>
        </tr>`;
        previous = record;
    }
    result += "</tbody></table>";
    return result;
}