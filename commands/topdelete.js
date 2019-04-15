const mongoose = require('mongoose');
const Ranking = require('../models/ranking');
const Tracking = require('../models/tracking');

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
        if(!res) message.reply(`The ranking "${topname.join('')}" doesn't exists... so, uhhm, yeah, consider that I successfully deleted it uwu`);
            else message.reply(`I deleted the ranking "${topname.join('')}"`);
    })
    
    Tracking.findOneAndDelete({
        idGuild : message.guild.id,
        nameoftop : topname.join('')
    },(err, res) => {
        if(err){
            console.log("Error when deleting a tracked ranking.")
        }
    })
    
}