const result = require('dotenv').config();

// Config file for api keys ect
module.exports = {
    
    apikey: process.env.API_KEY,
    token: process.env.BOT_TOKEN,
    ranking: process.env.MONGO_URI_R,
    prefix: "!"

};