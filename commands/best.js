const osu = require('osu.js');
const func = require('../Modules/functions');
const Discord = require('discord.js');

exports.run = (bot, message) => {
    const osuApi = new osu.api(bot.config.apikey);
    let argsname = message.content.split(' ');
    argsname.shift(); // Delete "!best"
    let argsmode = message.content.split('m=');
    argsmode.shift();
    if(argsmode.length > 0)
        argsname.pop();
    
        osuApi.getUserBest({ "u": argsname.join(" "), "m": argsmode.join('')}).then(scores => {
            if(scores.length < 3) return message.reply("The user needs to have 3 ranked scores or more in the required mod");
            (async function loop() {
                for (let index = 0; index < 3; index++) {
                    await osuApi.getBeatmaps({ "b": scores[index].beatmap_id, "m": argsmode.join(''), "a": 1 }).then(beatmaps => {
                    const embed = new Discord.RichEmbed()
                    .setTitle(`#${index + 1}\r\n`)
                    .setColor(0x800000)
                    .addField(`${beatmaps[0].artist} - ${beatmaps[0].title} [${beatmaps[0].version}] - **${scores[index].pp} PP**`,`[View beatmap](https://osu.ppy.sh/b/${scores[index].beatmap_id})`)
                    .setThumbnail("https://b.ppy.sh/thumb/" + beatmaps[0].beatmapset_id + ".jpg")
                    .setFooter(`${argsname.join(" ")}'s #${index + 1} best performance`);
                    message.channel.send({ embed });
                }).catch(err => {
                    return message.reply("Unknow error :c");
                });
                }
            })();
        }).catch(err => {
            console.log(err);
            return message.reply("I couldn't find the user's information :c" +
            "\r\n Please, verify if the player has played the desired mode or if you typed a wrong name ^^");
        });
    }
