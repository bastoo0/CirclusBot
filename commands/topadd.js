const osu = require('osu.js');
const mongoose = require('mongoose');
const Ranking = require('../models/ranking');
const func = require('../Modules/functions');

exports.run = async (bot, message) => {

    var arraysget = func.toparrays(message);
    let topname = arraysget[0];
    let argsname = arraysget[1];
    let argsmode = arraysget[2];

    if(argsname.length < 1) 
        return message.reply("Please write at least one player to add to the ranking ^^")
    if(topname.length <1)
        return message.reply(`Please, write a name for the ranking to modify (ex: !topadd "name" Player1 Player2...) ^^`);
    
    const osuApi = new osu.api(bot.config.apikey);
    var tabplayers = new Array();
    var errVal = false;
        (async function loop() {
            for (let i = 0; i < argsname.length; i++) {
                await osuApi.getUser({ "u": argsname[i], "m": argsmode.join('') }).then(user => {
                    if (user[0].username.indexOf(' ') !== -1) {
                        tabplayers[i] = "#" + user[0].username + "#";
                    } else tabplayers[i] = user[0].username;
                }).catch(error => {
                    message.reply("Error: Username(s) or command might be wrong ^^'");
                    errVal = true;
                });
            }
            if (!errVal) {
                mongoose.connect(bot.config.ranking, {useNewUrlParser: true});
                Ranking.findOne({
                    idguild : message.guild.id,
                    nameoftop : topname
                    }, (err, rank) => {
                        if(err) {
                            return message.reply('An error happend :c Please verify your command');
                        }
                        if(!rank){
                            return message.reply("The ranking you want to edit doesn't exist :c\r\n" +
                            "You can create one with the !topsetup command\r\nUse !circlus for more help ^^");
                        }
                        else {
                            rank.players = rank.players + " " + tabplayers.join(' ');
                            rank.save().catch(err => console.log(err));
                            return message.reply(`I edited the ranking with ${tabplayers.join(", ")} ^^`);
                        }
                    })
                }
        })();
};