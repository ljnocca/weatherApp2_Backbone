//currently.icon    hourly.data.icon      daily.data.icon

// 2. weather image based on icon state
// clear-day, * Sun.svg
// clear-night, * Moon.svg
// rain, * Cloud-Rain.svg
// snow, * Cloud-Snow.svg
// sleet, * Cloud-Hail.svg
// wind, * Wind.svg
// fog, * Cloud-Fog.svg
// cloudy, - Cloud.svg
// partly-cloudy-day, * Cloud-Sun.svg
// partly-cloudy-night * Cloud-Moon.svg
//'<object data="climacons-master/SVG/Thermometer.svg" type="image/svg+xml"></object>'

// API URLS:
var baseURL = 'https://api.darksky.net/forecast/f693ad4fa47137321f70f403e91be488/'
var googleAPI = 'https://maps.googleapis.com/maps/api/geocode/json?address='

// GLOBAL DOM-NODES:
var navNode = document.querySelector('.navBar')
var loadingIcon = document.querySelector('#loader')
var searchNode = document.querySelector('.searchBar')
var containerNode = document.querySelector('.weatherContainer')

// CONTROLLER:
var WeatherRouter = Backbone.Router.extend({
	routes:{
		":lat/:lng/current" : 'showCurrent',
		":lat/:lng/daily" : 'showDaily',
		":lat/:lng/hourly" : 'showHourly',
		"*Default" : "redirect2Current"
	},

	showCurrent: function(lat, lng){
		var weatherPromise = $.getJSON(baseURL+lat+','+lng+'?callback=?')
		showGif()
		weatherPromise.then(currentHTML)
	},
	showDaily: function(lat, lng){
		var weatherPromise = $.getJSON(baseURL+lat+','+lng+'?callback=?')
		showGif()
		weatherPromise.then(handleDaily)
	},
	showHourly: function(lat, lng){
		var weatherPromise = $.getJSON(baseURL+lat+','+lng+'?callback=?')
		showGif()
		weatherPromise.then(handleHourly)
	},
	redirect2Current: function(){
		navigator.geolocation.getCurrentPosition(handleCoords)
	}
})

function handleCoords (coordsObj) { 
    var lat = coordsObj.coords.latitude
    var lng = coordsObj.coords.longitude
    
    navNode.addEventListener('click',function(event){
        window.location.hash = lat + '/' + lng + event.target.value
    })

    window.location.hash =  lat + '/' + lng + '/current'
}

//*******************************************************************
//LOADING GIF - SHOW & HIDE
//*******************************************************************

function hideGif() {
    var loadingIcon = document.querySelector('#loader')
    loadingIcon.style.display = 'none'
}

function showGif() {
    var loadingIcon = document.querySelector('#loader')
    loadingIcon.style.display = 'block'
}

//*******************************************************************
//CURRENT WEATHER VIEW
//*******************************************************************
function currentHTML(currentWeather) {
	var htmlString = ''
    var containerNode = document.querySelector('.weatherContainer')
    htmlString += '<div class="innerDiv currentWeather">'
    htmlString +=	'<h1>NOW</h1>'
    htmlString += 	'<h3>'+ currentWeather.currently.summary+ '</h3>'
    htmlString += 	'<h3><object data="climacons-master/SVG/Thermometer.svg" type="image/svg+xml"></object>' + Math.floor(currentWeather.currently.temperature) + ' &#8457'
    htmlString += 	' | Feels like ' + Math.floor(currentWeather.currently.apparentTemperature) + ' &#8457</h3>'
    htmlString += 	'<h4><object data="climacons-master/SVG/Umbrella.svg" type="image/svg+xml"></object>'+ Math.floor(currentWeather.currently.precipProbability*100) + '% chance of rain</h5>'
    // htmlString +=   '<canvas id="current" width="128" height="128"></canvas>'
    htmlString += '</div>'
    containerNode.innerHTML= htmlString
    // activateCurrentSkycon()
    hideGif()
}

//*******************************************************************
//DAILY WEATHER VIEW
//*******************************************************************
function handleDaily(arrayOfObjects){
	var arrayToHTML = ''
	var dailyArray = arrayOfObjects.daily.data
	var containerNode = document.querySelector('.weatherContainer')
	for (var i = 0; i<7; i++){
		arrayToHTML += dailyHTML(dailyArray[i])
	}
	containerNode.innerHTML = arrayToHTML
    hideGif()
}

function dailyHTML(dailyWeather) {
    var htmlString = ''
    htmlString += '<div class="innerDiv">'
    htmlString += 	'<h3><u>' + dayConverter(dailyWeather.time)+ '</u></h3>'
    htmlString += 	'<h4>Temp: ' + Math.floor(dailyWeather.temperatureMax)+ ' / ' + Math.floor(dailyWeather.temperatureMin) +  '&#8457</h4>'
    htmlString += 	'<h4>'+ dailyWeather.summary+ '</h4>'
    htmlString += 	'<h4>Chance of rain: '+ Math.floor(dailyWeather.precipProbability * 100) + ' %</h4>'
    htmlString += '</div>'
    return htmlString
}

function dayConverter (unixTime){
  	var date = new Date(unixTime*1000);
	var day = date.getDay();
    if (day === 1){
        return 'Mon'
    }if (day === 2){
        return 'Tue'
    }if (day === 3){
        return 'Wed'
    }if (day === 4){
        return 'Thu'
    }if (day === 5){
        return 'Fri'
    }if (day === 6){
        return 'Sat'
    }if (day === 0){
        return 'Sun'
    }
}

//*******************************************************************
//HOURLY WEATHER VIEW
//*******************************************************************
function handleHourly(arrayOfObjects){
	var arrayToHTML = ''
	var hourlyArray = arrayOfObjects.hourly.data
	var containerNode = document.querySelector('.weatherContainer')
	for (var i = 0; i<7; i++){
		arrayToHTML += hourlyHTML(hourlyArray[i])
	}
	containerNode.innerHTML = arrayToHTML
    hideGif()
}

function hourlyHTML(hourlyWeather) {
	var htmlString = ''
	htmlString += '<div class="innerDiv">'
    htmlString += 	'<h3>' + hourConverter(hourlyWeather.time) + '</h3>'
    htmlString += 	'<h4>'+ hourlyWeather.summary+ '</h4>'
    htmlString += 	'<h4>Temperature: ' + Math.floor(hourlyWeather.temperature) + ' &#8457</h4>'
    htmlString += 	'<h4>Chance of rain: '+ Math.floor(hourlyWeather.precipProbability*100) + ' %</h4>'
    htmlString += '</div>'
    return htmlString
}

function hourConverter(timestamp) {
  var d = new Date(timestamp * 1000),
		hh = d.getHours(),
		h = hh,
		min = ('0' + d.getMinutes()).slice(-2),
		ampm = 'AM',
		time;
			
	if (hh > 12) {
		h = hh - 12;
		ampm = 'PM';
	} else if (hh === 12) {
		h = 12;
		ampm = 'PM';
	} else if (hh == 0) {
		h = 12;
	}
	time = h + ':' + min + ' ' + ampm;	
	return time;
}

//*******************************************************************
//GOOGLE - SEARCH FOR WEATHER BY CITY
//*******************************************************************
searchNode.addEventListener('keydown',function (event){
	if (event.keyCode === 13){
		var city = event.target.value
		
		var firstLetter = city.substring(0,1).toUpperCase()
		var capitalizedCity = firstLetter + city.substring(1,city.length)
		var pageName = document.querySelector('#pageName')
		pageName.innerHTML = '<h1>'+ capitalizedCity + " Weather</h1>"
		
		var googlePromise = $.getJSON(googleAPI+city)
		googlePromise.then(handleCity)
		event.target.value = ''
	}
})
		
function handleCity (apiResponse){
	var lat = apiResponse.results[0].geometry.location.lat
	var lng = apiResponse.results[0].geometry.location.lng
	window.location.hash = lat + '/' + lng + '/current'

	navNode.addEventListener('click',function(event){
    	window.location.hash = lat + '/' + lng + event.target.value
    })
}


// CREATE NEW INSTANCE OF CONTROLLER & RUN IT:
var instance = new WeatherRouter()
Backbone.history.start()