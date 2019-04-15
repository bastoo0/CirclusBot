const mongoose = require('mongoose');
const Tracking = require('../models/tracking');
const Ranking = require('../models/ranking');
exports.run = (bot, message) => {

    var top = message.content.split(" ");
    top.splice(0, 1);

    mongoose.connect(bot.config.ranking, {useNewUrlParser: true});
                Ranking.findOne({
                    idguild : message.guild.id,
                    nameoftop : top
                    }, (err, rank) => {
                        if(err) {
                            return message.reply('An error happend :c Please verify your command');
                        }
                        if(!rank){
                            return message.reply("I couldn't find your ranking :c Make sure your ranking exists by typing !toplist");
                        }
                        else {
                            const newTracking = new Tracking({
                                idChannel: message.channel.id,
                                idGuild: message.guild.id,
                                nameoftop: rank.nameoftop
                            })
                            newTracking.save().catch(err => console.log(err));
                            return message.reply(`I successfully added the ranking" ${rank.nameoftop}" to the tracking! ^^\r\nI'll update it in this channel!` );
                        }
                    })
}