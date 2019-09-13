const osu = require('osu.js');
const mongoose = require('mongoose');
const Ranking = require('../models/ranking');
const func = require('../Modules/functions');

exports.run = (bot, message) => {
    var arraysget = func.toparrays(message);
    if(arraysget === -1) return message.reply('Error in typing the command, type "!circlus" for help :)');
    let topname = arraysget[0];
    let argsname = arraysget[1];
    if (argsname.length < 1)
        return message.reply(`Please write at least one player to remove of the ranking and the name of the ranking (ex: !toprm "name" Player1 Player2...)^^`);
    if (topname.length < 1)
        return message.reply(`Please, write a name for the ranking to modify (ex: !toprm "name" Player1 Player2...) ^^`);
    mongoose.connect(bot.config.ranking, { useNewUrlParser: true });
    Ranking.findOne({
        idguild: message.guild.id,
        nameoftop: topname[0]
    }, (err, rank) => {
        if (err) {
            return message.reply('Something went wrong :c Please verify your command');
        }
        if (!rank) {
            return message.reply("The ranking you want to edit doesn't exist :c\r\n" +
                "You can create one with the !topsetup command\r\nUse !circlus for more help ^^");
        } else {
            argsmode = rank.mode.toString();
            const osuApi = new osu.api(bot.config.apikey);
            var tabpp = new Array();
            var tabid = new Array();
            var errVal = false;
            (async function loop() {
                for (let i = 0; i < argsname.length; i++) {
                    await osuApi.getUser({ "u": argsname[i], "m": argsmode, "type":String }).then(user => {
                        tabpp[i] = user[0].pp_raw;
                        tabid[i] = user[0].user_id;
                    }).catch(error => {
                        message.reply("Error: Username(s) or command might be wrong ^^'");
                        errVal = true;
                        return;
                    });
                }
                if(!errVal){
                    oldID = rank.players.split(" ");
                    oldpp = rank.pp.split(" ");
                    for (var index = 0; index < oldID.length; index++) {
                        for(var i = 0; i< tabid.length; i++) {
                            if (oldID[index] === tabid[i]) {
                                oldID.splice(index, 1);
                                tabid.splice(i, 1);
                                oldpp.splice(index,1);
                            }
                        }
                    }
                    if (oldID === rank.players.split(" "))
                        return message.reply("Oops, those players were apparently missing from the ranking uwu"); 

                    rank.players = oldID.join(" ");
                    rank.pp = oldpp.join(" ");
                    rank.save().catch(err => console.log(err));
                    return message.reply(`Successfuly removed the players from the ranking ^^`);
                 }
            })();
        }
    })
}
             // Used to manage players listed by username, now deprecated because of IDs
/* 
            let result = func.toparrays(command);
            let previous = result[1];
            var tabpp = rank.pp.split(" ");
            var splayers = "";
            var spp = "";
            var s = 0;
            for (var index = 0; index < argsname.length; index++) {
                if(previous.includes(argsname[index])) {
                    s = previous.indexOf(argsname[index]);
                    previous.splice(s,1);
                    tabpp.splice(s,1);
                }
            }
           
           for (var i = 0; i < previous.length; i++) {
                if (previous[i].indexOf(' ') !== -1)
                    splayers += "#" + previous[i] + "# ";
                else splayers += previous[i] + " ";
                spp += tabpp[i] + " ";
                }
            
            if (splayers === rank.players)
                return message.reply("Oops, those players were apparently missing from the ranking uwu");
            else {
                if (splayers.endsWith(" "))
                    splayers = splayers.slice(0, -1);
                if (spp.endsWith(" "))
                    spp = spp.slice(0, -1);

                rank.players = splayers;
                rank.pp = spp;
                rank.save().catch(err => console.log(err));
                return message.reply(`Successfuly removed the players from the ranking ^^`);
            }
        }
    })
}*/