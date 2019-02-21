const osu = require('osu.js');
const func = require('../Modules/functions');
const Discord = require('discord.js');

exports.run = (bot, message) => {
    const osuApi = new osu.api(bot.config.apikey);
    let argsname = message.content.split(' ');
    argsname.shift(); // Delete "!rank"
    argsname.splice(1);

    //Managing the second part of the command (mode selection)
    let argsmode = message.content.split('=');
    argsmode.shift();

    osuApi.getUser({ "u": argsname.join("%20"), "m": argsmode.join('') }).then(user => { // Getting profile info
        osuApi.getUserBest({ "u": user[0].username, "m": argsmode.join('') }).then(scores => { // Getting best scores from the user
            const profilepic = "https://a.ppy.sh/" + user[0].user_id;
            var Mode = func.getModPic(scores[0].enabled_mods);
            osuApi.getBeatmaps({ "b": scores[0].beatmap_id, "m": argsmode.join('') }).then(beatmaps => { // Getting info from the best score beatmap
                const title = beatmaps[0].artist + " - " + beatmaps[0].title;
                const embed = new Discord.RichEmbed()
                    .setTitle("** :flag_" + user[0].country.toLowerCase() + ":   " + user[0].username + "**'s " + func.getMode(argsmode.join('=')) + " Profile Card")
                    .setColor(0x800000)
                    .setFooter("Some osu!profile card")
                    .setTimestamp()
                    .setURL("https://osu.ppy.sh/users/" + user[0].user_id)
                    .setThumbnail(profilepic)
                    .addField("Performance : ", "**" + user[0].pp_raw.replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ') + " PP**\r\nAccuracy : " + func.precise(user[0].accuracy, 4) + "%")
                    .addField("Ranking : ", "Global #**" + user[0].pp_rank + "**\r\n" + user[0].country + " #**" + user[0].pp_country_rank + "**")
                    .addField("Playcount : ", user[0].playcount + " plays\r\n" + func.secondsToHms(user[0].total_seconds_played) + " played")
                    .setImage("https://b.ppy.sh/thumb/" + beatmaps[0].beatmapset_id + ".jpg");
                if (Mode.modname.length <= 9 && Mode.modname.length > 1)
                    embed.addField("Top Performance :", title + " (" + func.precise(beatmaps[0].difficultyrating, 3) + "*) - **" + scores[0].pp + " PP** " + Mode.modname);
                else embed.addField("Top Performance :", title + " (" + func.precise(beatmaps[0].difficultyrating, 3) + "*) - **" + scores[0].pp + " PP**");
                message.channel.send({ embed });
            });
        });
    }).catch(err => {
        message.reply("I couldn't find this user :c");
    });
}