const osu = require('osu.js');

exports.run = (bot, message) => {
    const osuApi = new osu.api(bot.config.apikey);
    let argsname = message.content.split(' ');
    argsname.shift(); // Delete "!best"
    let argsmode = message.content.split('m=');
    argsmode.shift();
    if(argsmode.length > 0)
        argsname.pop();
        
    osuApi.getUser({ "u": argsname.join(' '), "m": argsmode.join(''), "type":String }).then(user => {
        message.reply("\r----- " + user[0].username + " ranking -----\r" + "PP: " + user[0].pp_raw + "\rRank: " + user[0].pp_rank
            + "\rAccuracy: " + user[0].accuracy);
    }).catch(err => {
        return message.reply("I couldn't find this user :c");
    });
}