const osu = require('osu.js');

exports.run = (bot, message) => {
    const osuApi = new osu.api(bot.config.apikey);
    let argsname = message.content.split(' '); // Splits the command between "rank" and the following statements
    argsname.shift(); // Delete "!rank"
    argsname.splice(1);
    let argsmode = message.content.split('=');
    argsmode.shift();
    osuApi.getUser({ "u": argsname.join(''), "m": argsmode.join('') }).then(user => {
        message.reply("\r" + user[0].username + " Ranking:\r" + "PP: " + user[0].pp_raw + "\rRank: " + user[0].pp_rank
            + "\rAccuracy: " + user[0].accuracy);
    }).catch(err => {
        message.reply("I couldn't find this user :c");
    });
}