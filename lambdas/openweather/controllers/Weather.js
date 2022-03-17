const axios = require('axios')
const SecretsManager = require('./secretsManager');
const redis = require("redis")
     
   
exports.getCurrenWeather = async (req, res) => {
 

  try {

    const city = req.query.city
    
//     const redisOptions = {
//     host: "mycluster.kneaye.0001.use1.cache.amazonaws.com",
//     port: 6379
// }

    // const client = redis.createClient(redisOptions)

    // console.info('Connected to Redis Server')
    // client.on('error', (err) => console.log('Redis Client Error: ', err));
    
    // console.log("Connecting to Redis...");
    // await client.connect();
    // console.log("Connected to Redis");

    // const redisKey = city
    // console.log("Looking up metadata in Redis for " + redisKey);

    // const redisMeta = await client.get(redisKey);

    // if (redisMeta){
    //    return res.status(200).json({ status:true, data: redisMeta});
    // }

    var secretName = "ApiKey";
    var region = "us-east-2";
    var apiValue = await SecretsManager.getSecret(secretName, region);

   const Secretkey = JSON.parse(apiValue)

   const openApiKey = Secretkey.OPEN_WEATHER_API_KEY

  

    const CurrenWeather = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openApiKey}`)

                // // STORE TO REDIS
                // await client.set(redisKey, JSON.stringify(CurrenWeather.data));

   
    return res.status(200).json({ status:true, data: CurrenWeather.data});


   
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};