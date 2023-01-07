
const axios = require('axios')
const SecretsManager = require('../utils/secretsManager');
const redis = require("redis")

const retrieveWeather = async (city) => {

    const redisOptions = {
        url: "rediss://weather-001.yo10re.0001.use1.cache.amazonaws.com:6379",
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


    if (redisMeta) {
        return res.status(200).json({ status: true, data: redisMeta });
    }
 
    var secretName = "weather";

    var region = "us-east-1";

    var apiValue = await SecretsManager.getSecret(secretName, region);

    if (!apiValue) {
        return {
            status: false,
            message: "API secret not found",
            data:{}
        } 
    }
    
    const Secretkey = JSON.parse(apiValue)

    const openApiKey = Secretkey.OPEN_WEATHER_API_KEY


    const currenWeather = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openApiKey}`)

    await client.set(city, JSON.stringify(currenWeather.data))

    await client.disconnect()

    return {
        status: true,
        message:"Weather data retrieved successfully",
        data: currenWeather.data
    }

    // const celCius = 500 - 273.15

    // // STORE TO REDIS
    // await client.set(redisKey, JSON.stringify(CurrenWeather.data));
}

module.exports = retrieveWeather