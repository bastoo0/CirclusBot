const osu = require('osu.js');
const mongoose = require('mongoose');
const Ranking = require('../models/ranking.js');
const Tracking = require('../models/tracking.js');

function track(bot) {
    mongoose.connect(bot.config.ranking, { useNewUrlParser: true });
    const osuApi = new osu.api(bot.config.apikey);
    Tracking.find({}, (err, docs) => {
        if (err) {
            console.log(err);
        }
        if (!docs) {
            console.log("doc not found somewhere");
        } else {
            docs.forEach(tracking => {
                Ranking.findOne({
                    idguild: tracking.idGuild,
                    nameoftop: tracking.nameoftop
                }, (err, rank) => {
                    if (err) {
                        console.log(err);
                    }
                    if (!rank)
                        console.log("Ranking " + tracking.nameoftop + " not found for guild " + tracking.idGuild);
                    else {
                        var arrPlayersID = rank.players.split(" ");
                        var arrMode = rank.mode;

                        if (arrPlayersID.length < 1)
                            console.log("The top " + rank.nameoftop + "is empty for guild " + rank.idGuild);
                        var pptab = new Array();
                        var tabid = new Array();
                        (async function loop() {
                            for (let i = 0; i < arrPlayersID.length; i++) {
                                await osuApi.getUser({ "u": arrPlayersID[i], "m": arrMode, "type": String }).then(user => {
                                    pptab[i] = user[0].pp_raw;
                                    tabid[i] = user[0].user_id;
                                }).catch(error => {
                                    console.log(error);
                                    pptab = [];
                                    tabid = [];
                                })
                            }
                            if (tabid.length > 0 && pptab.length > 0) {
                                var oldpp = rank.pp.split(" ");
                                var newlist = [];
                                var oldlist = [];
                                for (let i = 0; i < pptab.length; i++) {
                                    newlist.push({ 'name': tabid[i], 'pp': parseFloat(pptab[i]) });
                                    oldlist.push({ 'name': arrPlayersID[i], 'pp': parseFloat(oldpp[i]) });
                                }
                                newlist.sort(function (a, b) {
                                    return ((a.pp < b.pp) ? -1 : ((a.pp == b.pp) ? 0 : 1));
                                });

                                oldlist.sort(function (a, b) {
                                    return ((a.pp < b.pp) ? -1 : ((a.pp == b.pp) ? 0 : 1));
                                });

                                async function rankchanges() {
                                    var result = "";
                                    var player;
                                    var gain;
                                    for (let i = 0; i < newlist.length; i++) {
                                        if (newlist[i].name != oldlist[i].name) {
                                            player = oldlist[i].name;
                                            for (let n = i; n < newlist.length; n++) {
                                                if (player == newlist[n].name) {
                                                    gain = n - i;
                                                    await osuApi.getUser({ "u": player, "m": arrMode, "type": String }).then(user => {
                                                        result += user[0].username + " gained " + gain + " rank(s)!\r\n"
                                                    })
                                                }
                                            }
                                        }
                                    }
                                    return result;
                                }
                                
                                var changes = await rankchanges();
                                if (changes !== "") {
                                    var newplayers = "";
                                    var newpp = "";
                                    for (let i = 0; i < newlist.length; i++) {
                                        newplayers += newlist[i].name + " ";
                                        newpp += newlist[i].pp + " ";
                                    }
                                    if (newplayers.endsWith(" ")) newplayers = newplayers.slice(0, -1);
                                    if (newpp.endsWith(" ")) newpp = newpp.slice(0, -1);

                                    rank.players = newplayers;
                                    rank.pp = newpp;
                                    rank.save().catch(err => console.log(err));
                                    bot.channels.get(tracking.idChannel).send('Something happened in the ranking "' + rank.nameoftop + '":\r\n' + changes + "\r\n\r\nType !top " + rank.nameoftop + " to see the full ranking ^^");
                                }
                            }
                        })();
                    }
                });
            });
        }
    });
}

module.exports = {
    track
}