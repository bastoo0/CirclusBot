const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const Discord = require('discord.js');
const bot = new Discord.Client();
const Enmap = require("enmap");

bot.config = require('./config.js');
bot.commands = new Enmap();
bot.logs = require('./Modules/FancyLogs.js');

const init = async () => {

    // Loading commands as a collection
    const cmdFiles = await readdir("./commands/");
    bot.logs.log(`Loading a total of ${cmdFiles.length} commands.`);
    cmdFiles.forEach(f => {
        if (!f.endsWith(".js")) return;
        let props = require(`./commands/${f}`);
        let commandName = f.split(".")[0];
        console.log(`Attempting to load command ${commandName}`);
        bot.commands.set(commandName, props);
    });

    // Loading events
    const evtFiles = await readdir("./events/");
    bot.logs.log(`Loading a total of ${evtFiles.length} events.`);
    evtFiles.forEach(file => {
        const eventName = file.split(".")[0];
        bot.logs.log(`Loading Event: ${eventName}`);
        const event = require(`./events/${file}`);
        // Bind the bot to any event, before the existing arguments
        // provided by the discord.js event. 
        bot.on(eventName, event.bind(null, bot));
    });

    bot.login(bot.config.token);

}
// Bot init
init();

bot.loadCommand = (commandName) => {
    try {
        bot.logs.log(`Loading Command: ${commandName}`);
        const props = require(`./commands/${commandName}`);
        if (props.init) {
            props.init(client);
        }
        bot.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            bot.aliases.set(alias, props.help.name);
        });
        return false;
    } catch (e) {
        return `Unable to load command ${commandName}: ${e}`;
    }
};


bot.on("ready", () => {
    //bot.user.setActivity(`on ${bot.guilds.size} servers`);
    bot.user.setActivity(`being maintained, just ignore me xd`);
    console.log(`Ready to serve on ${bot.guilds.size} servers, for ${bot.users.size} users.`);
});



