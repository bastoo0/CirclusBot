const mongoose = require('mongoose');

const rankingSchema = mongoose.Schema({
    idguild : String,
    nameoftop : String,
    players : String,
    pp : String,
    mode : Number
});

module.exports = mongoose.model("Ranking", rankingSchema);