// This works the same as the !top command, just changing some values and the ranking style
const osu = require('osu.js');
const mongoose = require('mongoose');
const Ranking = require('../models/ranking.js');

exports.run = (bot, message) => {

    getranking(bot, message.guild.id, message).then(top => {
        var command = new Array();
        command[0] = "**" + top[top.length - 1].name + "** is in the lead! \r\n";
        command[1] = "";
        var numcmd = 0;
        command[0] += "```\r\n╔══════╦═════════════════╦════════════════════╗\r\n";
        command[0] += "║ Rank ║     Players     ║ Total ranked score ║\r\n";
        var playerspace = "";
        var scorespace = "";
        for (let i = top.length - 1, n = 1; i >= 0; i-- , n++) {
            if(command[0].length > 1700 && numcmd === 0) {
                numcmd = 1;
                command[0] += "```";
                command[1] += "```r\n"
            }
            command[numcmd] += "╠══════╬═════════════════╬════════════════════╣\r\n";
            for (let x = 0; x < 15 - top[i].name.length; x++)
                playerspace += " ";
            for (let x = 0; x < 15 - top[i].score.toString().length; x++)
                scorespace += " ";

            if(n<10)
                command[numcmd] += "║ #" + n + "   ║ " + top[i].name + playerspace + " ║ " + top[i].score.toString().replace(/(.)(?=(.{3})+$)/g,"$1,") + scorespace + " ║\r\n";
            else command[numcmd] += "║ #" + n + "  ║ " + top[i].name + playerspace + " ║ " + top[i].score.toString().replace(/(.)(?=(.{3})+$)/g,"$1,") + scorespace + " ║\r\n";

            playerspace = "";
            scorespace = "";
        }
        bot.logs.log(message.content);
        command[numcmd] += "╚══════╩═════════════════╩════════════════════╝```";
        if(command[1].length + command[0].length > 4000) message.channel.send("You've got too many players in your ranking, I can't display it :c");
        (async function loop() {
            await message.channel.send(command[0]);
            if(command[1].length > 0) message.channel.send(command[1]);
        })();

        })
      .catch (e => {
        bot.logs.log(e);
        message.reply("Error while requesting the ranking :c");
    })
}

function getranking(bot, idGuild, command) {
    mongoose.connect(bot.config.ranking, {useNewUrlParser: true});
    const osuApi = new osu.api(bot.config.apikey);
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

                    if(arrPlayers.length < 1)
                        return message.reply("Your top is empty, please add some players with !topadd");
                    var scoretab = new Array();
                    var tabplayers = new Array();
                    (async function loop() {
                        for (let i = 0; i < arrPlayers.length; i++) {
                            await osuApi.getUser({ "u": arrPlayers[i], "m": arrMode, "type":String }).then(user => {
                                scoretab[i] = user[0].ranked_score;
                                tabplayers[i] = user[0].username;
                            }).catch(error => {
                                reject(error);
                            })
                        }
                        var list = [];
                        for (let i = 0; i < scoretab.length; i++)
                            list.push({ 'name': tabplayers[i], 'score': parseFloat(scoretab[i]) });

                        list.sort(function (a, b) {
                            return ((a.score < b.score) ? -1 : ((a.score == b.score) ? 0 : 1));
                        });
                        resolve(list);
                    })();
                }
        })
    })
}