const osu = require('osu.js');
const mongoose = require('mongoose');
const Ranking = require('../models/ranking');
const func = require('../Modules/functions');

exports.run = (bot, message) => {
    var idGuild = message.guild.id;

    var arraysget = func.toparrays(message);
    if(arraysget === -1) return message.reply('Error in typing the command, type "!circlus" for help :)');
    let topname = arraysget[0];
    let argsname = arraysget[1];
    let argsmode = arraysget[2];

    if(argsname.length < 1 || topname.length < 1)
    return message.reply('Error in typing the command, type "!circlus" for help :)')
    
    if(argsname > 20)
    return message.reply("Please don't add too many players... otherwise i'm gonna explode :x (max 20 players please :c)")

    const osuApi = new osu.api(bot.config.apikey);
    var tabID = new Array();
    var tabpp = new Array();
    var errVal = false;
        (async function loop() {
            for (let i = 0; i < argsname.length; i++) {
                await osuApi.getUser({ "u": argsname[i], "m": argsmode.join(''), "type":String }).then(user => {
                    tabpp[i] = user[0].pp_raw;
                    tabID[i] = user[0].user_id;
                }).catch(error => {
                    message.reply("Error: Username " + argsname[i] + " or command might be wrong ^^'");
                    errVal = true;
                    return;
                });
            }
            // Writing in the database if everything is alright 
            if (!errVal) {
                mongoose.connect(bot.config.ranking, {useNewUrlParser: true});
                Ranking.findOne({
                    idguild : idGuild,
                    nameoftop : topname[0]
                    }, (err, rank) => {
                        if(err) {
                            return message.reply('An error happend :c Please verify your command');
                        }
                        if(!rank){
                            const newRanking = new Ranking({
                                idguild: idGuild.toString(),
                                nameoftop: topname.join(''),
                                players: tabID.join(' '),
                                pp: tabpp.join(' '),
                                mode: argsmode.join('')
                            })
                            newRanking.save().catch(err => console.log(err));
                            return message.reply("Done <w<");
                        }
                        else {
                            rank.players = tabID.join(' ');
                            rank.pp = tabpp.join(' ');
                            rank.mode = argsmode.join('');
                            rank.save().catch(err => console.log(err));
                            return message.reply('I edited an existing ranking! ^^');
                        }
                    })
            }
        })();
}
