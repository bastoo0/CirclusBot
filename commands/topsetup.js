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
    
    const osuApi = new osu.api(bot.config.apikey);
    var tabplayers = new Array();
    var tabpp = new Array();
    var errVal = false;
        (async function loop() {
            for (let i = 0; i < argsname.length; i++) {
                await osuApi.getUser({ "u": argsname[i], "m": argsmode.join('') }).then(user => {
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
                                players: tabplayers.join(' '),
                                pp: tabpp.join(' '),
                                mode: argsmode.join('')
                            })
                            newRanking.save().catch(err => console.log(err));
                            return message.reply("Done <w<");
                        }
                        else {
                            rank.players = tabplayers.join(' ');
                            rank.pp = tabpp.join(' ');
                            rank.mode = argsmode.join('');
                            rank.save().catch(err => console.log(err));
                            return message.reply('I edited an existing ranking! ^^');
                        }
                    })
            }
        })();
}