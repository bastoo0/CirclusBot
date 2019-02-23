const osu = require('osu.js');
exports.run = (bot, message) => {
    const osuApi = new osu.api(bot.config.apikey);
    let args = message.content.split(' '); // Splits the command between "profilepic" and the following statements
    args.shift(); // Delete "!profilepic"
    osuApi.getUser({ "u": args.join(' '), "type":String }).then(user => {
        const profilepic = "https://a.ppy.sh/" + user[0].user_id;
         message.reply(`${user[0].username}'s profile picture on osu! :\r\n` + profilepic);
    }).catch(err => {
            message.reply("I couldn't find this user :c");
    });
}