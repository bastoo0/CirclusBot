const osu = require('osu.js');
exports.run = (bot, message) => {
    const osuApi = new osu.api(bot.config.apikey);
    let args = message.content.split(' '); // Splits the command between "profilepic" and the following statements
    args.shift(); // Delete "!profilepic"
    async function Call() {
            await osuApi.getUser({ "u": args.join('%20') }).then(user => {
            const profilepic = "https://a.ppy.sh/" + user[0].user_id;
            console.log(profilepic);
            message.reply('\r' + profilepic);
        })
    }
    Call();
}