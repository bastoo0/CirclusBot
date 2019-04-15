const mongoose = require('mongoose');

const trackingSchema = mongoose.Schema({
    idChannel : String,
    idGuild : String,
    nameoftop : String
});

module.exports = mongoose.model("Tracking", trackingSchema);