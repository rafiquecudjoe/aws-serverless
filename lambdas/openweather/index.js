const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');

const WeatherController = require('./controllers/Weather');



const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get('/v1/getCurrenWeather', WeatherController.getCurrenWeather);



module.exports.handler = serverless(app);
