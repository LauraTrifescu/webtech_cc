const express = require('express')
//const cool = require('cool-ascii-faces')
const app = express()
const Datastore =require('nedb');

const fetch = require("node-fetch");

app.use(express.json())
app.use(express.urlencoded())

app.use('/',express.static('frontend'))

const database = new Datastore('database.db');
database.loadDatabase();

//const allData = [];
app.post('/api', (request, response) =>{
    console.log("Request");
    console.log(request.body);
   
    const data = request.body;

    const timestamp = Date.now();
    data.timestamp = timestamp;
    
    database.insert(data);
    response.json({
        status: 'success',
        latitude: data.lat,
        timestamp: timestamp,
        longitude: data.lon
    });
});

app.get ('/air:latlon', async (request, response) =>{
	const latlon = request.param.latlon.split(',');
	const lat = latlon[0];
	const lon = latlon[1];
	
	const w_url = 'https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&appid=4e9f90c21002a038af331c4836321089&units=metric';
    const w_response = await fetch(w_url);
    const w_json =  await w_response.json();
    
    const a_url = 'https://api.openaq.org/v1/latest?coordinates='+lat+','+lon;
    const a_resp = await fetch(a_url);
    const a_json = await a_resp.json();
    
    const data = {
   	weather: w_json,
   	air_quality: a_json
   }
    response.json(data);
})




app.listen(process.env.PORT||8080)
//app.listen(8080)