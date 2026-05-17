
//api
//This function fetches the current temperature for Bamberg (center) and displays it in the banner on the page.
async function loadWeather() {
    const lat = 49.89;
    const lon = 10.89;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        const temp = data.current_weather.temperature;


        document.getElementById("score-banner-text").innerText =
            `Current temperature in Bamberg: ${temp}°C`;

        document.getElementById("score-banner").classList.add("visible");
    } catch (errordydydydududu) {
        console.error(errordydydydududu);
    }
}


//coordinate of our city
const bamberg = [49.89, 10.89];
const map = L.map("map").setView(bamberg, 13);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap"
}).addTo(map);
//locations
const points = [
    { name: "Center", lat: 49.89, lon: 10.89 },
    { name: "North", lat: 49.905, lon: 10.89 },
    { name: "South", lat: 49.875, lon: 10.89 },
    { name: "West", lat: 49.89, lon: 10.865 },
    { name: "East", lat: 49.89, lon: 10.915 }
];
//This function gets the current time in the Berlin timezone and formats it to match the time format used by the Open-Meteo API.
//  It allows to find the correct hourly weather data for the current hour.
function getBerlinCurrentHour() {
    const berlinTime = new Date().toLocaleString("sv-SE", {
        timeZone: "Europe/Berlin"
    });
    return berlinTime.slice(0, 13) + ":00:00";
}
//This function fetches rain data for multiple locations and displays them on the map as colored markers 
// to show where it is raining and where it is not.
async function loadRainMap() {
    const currentHour = getBerlinCurrentHour();

    for (const point of points) {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${point.lat}&longitude=${point.lon}&hourly=precipitation,precipitation_probability&timezone=Europe/Berlin`;

        try {
            const res = await fetch(url);
            const data = await res.json();

            const index = data.hourly.time.indexOf(currentHour);

            const rain = index >= 0 ? data.hourly.precipitation[index] : 0;
            const prob = index >= 0 ? data.hourly.precipitation_probability[index] : 0;

            const isRain = rain > 0.1 || prob > 50;
            const color = isRain ? "blue" : "green";

            L.circleMarker([point.lat, point.lon], {
                radius: 11,
                color: color,
                fillColor: color,
                fillOpacity: 0.7,
                weight: 3
            })
            .addTo(map)
            .bindPopup(`<b>${point.name}</b><br>Rain: ${rain} mm<br>Chance: ${prob}%`);

        } catch (lol) {
            console.error("Rain map error:", lol);
        }
    }
}



//buttons



//functions
loadWeather();
loadRainMap();