const osu = require('osu.js');

exports.run = (bot, message) => {
    const osuApi = new osu.api(bot.config.apikey);
    let args = message.content.split(' '); 
    args.shift(); 
    osuApi.getUser({ "u": args.join(' '), "type":String }).then(user => {
        const profilelink = "https://osu.ppy.sh/users/" + user[0].user_id;
        message.reply(`${user[0].username}'s profile on osu! :\r\n` + profilelink);
    }).catch(err => {
        return message.reply("I couldn't find this user :c");
    });
}