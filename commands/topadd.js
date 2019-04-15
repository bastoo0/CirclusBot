const osu = require('osu.js');
const mongoose = require('mongoose');
const Ranking = require('../models/ranking');
const func = require('../Modules/functions');

exports.run = (bot, message) => {
    var arraysget = func.toparrays(message);
    if(arraysget === -1) return message.reply('Error in typing the command, type "!circlus" for help :)');
    let topname = arraysget[0];
    let argsname = arraysget[1];
    var argsmode = "1";
    if (argsname.length < 1)
        return message.reply(`Please write at least one player to add to the ranking and the name of the ranking (ex: !topadd "name" Player1 Player2...)^^`)
    if (topname.length < 1)
        return message.reply(`Please, write a name for the ranking to modify (ex: !topadd "name" Player1 Player2...) ^^`);

    if(argsname > 20)
    return message.reply("Please don't add too many players... otherwise i'm gonna explode :x (max 20 players please :c)")
    
    mongoose.connect(bot.config.ranking, { useNewUrlParser: true });
    Ranking.findOne({
        idguild: message.guild.id,
        nameoftop: topname[0]
    }, (err, rank) => {
        if (err) {
            return message.reply('Something went wrong :c Please verify your command');
        }
        if (!rank) {
            return message.reply("The ranking that you want to edit doesn't exist :c\r\n" +
                "You can create one with the !topsetup command\r\nUse !circlus for more help ^^");
        } else {
            argsmode = rank.mode.toString();
            const osuApi = new osu.api(bot.config.apikey);
            var tabplayers = new Array();
            var tabpp = new Array();
            var errVal = false;
            (async function loop() {
                for (let i = 0; i < argsname.length; i++) {
                    await osuApi.getUser({ "u": argsname[i], "m": argsmode, "type":String }).then(user => {
                        tabpp[i] = user[0].pp_raw;
                        if (user[0].username.indexOf(' ') !== -1) {
                            tabplayers[i] = "#" + user[0].username + "#";
                        } else tabplayers[i] = user[0].username;
                    }).catch(error => {
                        message.reply("Error: Username(s) or command might be wrong ^^'");
                        errVal = true;
                        return;
                    });
                }
                if(!errVal){
                    rank.pp = rank.pp + " " + tabpp.join(' ');
                    rank.players = rank.players + " " + tabplayers.join(' ');
                    rank.save().catch(err => console.log(err));
                    return message.reply(`I edited the ranking with ${tabplayers.join(", ")} ^^`);
                }
            })();
        }
    })
}