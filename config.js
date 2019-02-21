const result = require('dotenv').config({path: __dirname + '/vars.env'});

// Config file for api keys ect
module.exports = {
    
    apikey: process.env.API_KEY,
    token: process.env.BOT_TOKEN,
    ranking: process.env.MONGO_URI,
    prefix: "!"

};