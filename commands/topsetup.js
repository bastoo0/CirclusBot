const osu = require('osu.js');
const config = require('../config.js');
const mongoose = require('mongoose');
const Ranking = require('../models/ranking');

exports.run = async (bot, message) => {
    var command = message;
    var idGuild = message.guild.id;
    mongoose.connect('mongodb://localhost:27017/Ranking', {useNewUrlParser: true});
    let argsname = command.content.split(' '); // Splits the command in an array at each space 
    for (let i = 0; i < argsname.length; i++) {
        if (argsname[i].startsWith("#")) {
            while (!argsname[i].endsWith("#")) {
                argsname.splice(i, 1);
            }
            argsname.splice(i, 1);
            i--;
        }
    }

    let temp = command.content.split('#');
    if (temp.length > 0) {
        for (let i = 0; i < temp.length; i++) {
            temp.splice(i, 1);
        }
    }

    argsname.splice(0, 2); // Delete the first part of the command

    let argsmode = command.content.split('=');
    argsmode.shift();
    if (!argsmode[0]) {
        argsmode[0] = "1";
    } else argsname.pop(); // Delete the mode from argsname if exists

    if (temp.length > 0)
    argsname.push(...temp);

    let topname = command.content.split('"');
    topname.shift();
    topname.pop();

    if(argsname.length < 1 || topname.length < 1)
    return message.reply('Error in typing the command, type "!circlus" for help :)')
    
    const osuApi = new osu.api(config.apikey);
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
                    message.reply("Error: Username or command might be wrong ^^'");
                    errVal = true;
                });
            }
            // Writing in the database if everything is alright 
            if (!errVal) {
                Ranking.findOne({
                    idguild : idGuild,
                    nameoftop : topname
                    }, (err, rank) => {
                        if(err) {
                            return message.reply('An error happend :c');
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
                            rannk.mode = argsmode.join('');
                            rank.save.catch(err => console.log(err));
                            return message.reply('I edited an existing ranking! ^^');
                        }
                    })
            }
        })();
}