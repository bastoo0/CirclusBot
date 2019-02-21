const osu = require('osu.js');
const config = require('../config.js');
const mongoose = require('mongoose');
const Ranking = require('../models/ranking.js');

exports.run = (bot, message) => {

    getranking(message.guild.id, message).then(top => {
            
        var command = "**" + top[top.length - 1].name + "** is in the lead! \r\n";
        command += "```fix\r\n╔══════╦═════════════════╦═════════════╗\r\n";
        command += "║ Rank ║     Players     ║ Performance ║\r\n";
        var playerspace = "";
        var ppspace = "";
        for (let i = top.length - 1, n = 1; i >= 0; i-- , n++) {
            command += "╠══════╬═════════════════╬═════════════╣\r\n";
            for (let x = 0; x < 15 - top[i].name.length; x++)
                playerspace += " ";
            for (let x = 0; x < 7 - top[i].pp.toString().length; x++)
                ppspace += " ";

            if(n<10)
                command += "║ #" + n + "   ║ " + top[i].name + playerspace + " ║ " + top[i].pp + " pp " + ppspace + " ║\r\n";
            else command += "║ #" + n + "  ║ " + top[i].name + playerspace + " ║ " + top[i].pp + " pp " + ppspace + " ║\r\n";

            playerspace = "";
            ppspace = "";
            }
        bot.logs.log(message.content);
        command += "╚══════╩═════════════════╩═════════════╝```";
        message.reply(command);
        })
      .catch (e => {
        bot.logs.log(e);
        message.reply("Error while requesting the ranking :c");
    })
}

function getranking(idGuild, command) {
    mongoose.connect('mongodb://localhost:27017/Ranking', {useNewUrlParser: true});
    const osuApi = new osu.api(config.apikey);
    let topname = command.content.split(' ');
    topname.shift();
    return new Promise((resolve, reject) => {
        Ranking.findOne({
            idguild : idGuild,
            nameoftop : topname
            }, (err, rank) => {
                if(err){
                    console.log(err);
                    reject("Error while retrieving the ranking :c");
                }
                if(!rank){
                    reject("I couldn't find the ranking :c");
                } else {
                    var arrPlayers = rank.players.split(" ");
                    var arrMode = rank.mode;

                    for (let i = 0; i < arrPlayers.length; i++) {
                        if (arrPlayers[i].startsWith("#")) {
                            while (!arrPlayers[i].endsWith("#")) {
                                arrPlayers.splice(i, 1);
                            }
                            arrPlayers.splice(i, 1);
                            i--;
                        }
                    }

                    let temp = rank.players.split('#');
                    if (temp.length > 0) {
                        for (let i = 0; i < temp.length; i++) {
                            temp.splice(i, 1);
                        }
                        arrPlayers.push(...temp);
                    }

                    var pptab = new Array();
                    var tabplayers = new Array();
                    (async function loop() {
                        for (let i = 0; i < arrPlayers.length; i++) {
                            await osuApi.getUser({ "u": arrPlayers[i], "m": arrMode }).then(user => {
                                pptab[i] = user[0].pp_raw;
                                tabplayers[i] = user[0].username;
                            }).catch(error => {
                                reject(error);
                            })
                        }
                        var list = [];
                        for (let i = 0; i < pptab.length; i++)
                            list.push({ 'name': tabplayers[i], 'pp': parseFloat(pptab[i]) });

                        list.sort(function (a, b) {
                            return ((a.pp < b.pp) ? -1 : ((a.pp == b.pp) ? 0 : 1));
                        });
                        resolve(list);
                    })();
                }
        })
    })
}