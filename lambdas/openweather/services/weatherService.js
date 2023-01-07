
const axios = require('axios')
const SecretsManager = require('../utils/secretsManager');
const redis = require("redis")

const retrieveWeather = async (city) => {

    const redisOptions = {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }

    const client = redis.createClient(redisOptions)

    console.info('Connected to Redis Server')
    client.on('error', (err) => console.log('Redis Client Error: ', err));

    console.log("Connecting to Redis...");
    await client.connect();
    console.log("Connected to Redis");

    const redisKey = city
    console.log("Looking up metadata in Redis for " + redisKey);

    const redisMeta = await client.get(redisKey);

    console.log(redisMeta)

    if (redisMeta) {
        return res.status(200).json({ status: true, data: redisMeta });
    } 

    var secretName = "weather";
    var region = "us-east-1";
    var apiValue = await SecretsManager.getSecret(secretName, region);

    const Secretkey = JSON.parse(apiValue)

    const openApiKey = Secretkey.OPEN_WEATHER_API_KEY



    const currenWeather = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openApiKey}`)

    await client.set(city, currenWeather.data)
    
    await client.disconnect()

    return currenWeather.data

    // const celCius = 500 - 273.15

    // // STORE TO REDIS
    // await client.set(redisKey, JSON.stringify(CurrenWeather.data));
}

module.exports = retrieveWeather