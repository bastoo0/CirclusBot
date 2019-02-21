const mongoose = require('mongoose');
const Ranking = require('../models/ranking');

exports.run = (bot, message) => {
    mongoose.connect('mongodb://localhost:27017/Ranking', {useNewUrlParser: true});
    let topname = message.content.split(' ');
    topname.shift();
    Ranking.findOneAndDelete({
        idguild : message.guild.id,
        nameoftop : topname.join('')
    },(err, res) => {
        if(err){
            message.reply("This top doesn't exist ^^'");
        }
            message.reply(`I deleted the ranking "${topname.join('')}"`);
    })
}