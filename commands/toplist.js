const mongoose = require('mongoose');
const Ranking = require('../models/ranking');

exports.run = (bot, message) => {
    mongoose.connect(bot.config.ranking, {useNewUrlParser: true});
    Ranking.find({idguild : message.guild.id}, (err, docs) => {
        if(err){
            message.reply("An error occured :c");
        }
        if (docs.length > 0){
            var list = [];
            for (let index = 0; index < docs.length; index++) {
                list.push(docs[index].nameoftop);
            }
            message.reply("List of the rankings you have in your server:\r\n" + list.join("\r\n"));
        }
        else message.reply(`You don't have any ranking set up in our server :c\r\nYou can type "!circlus" for help ^^`);
    });
}
