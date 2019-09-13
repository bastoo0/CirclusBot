exports.run = (bot, message) => {
    message.reply("This is what I can do for your server ^^\r\n\r\n---------- **Ranking commands** ---------- \r\n" +
        "For those commands, if you write an username containing spaces, please use \"#\" to delimit it.\r\n" + 
        "**!topsetup** -- Create a personalized ranking!\r\n" +
        "You can create a ranking this way --> *!topsetup \"NameOfTheTop\" username1 username2 #username with spaces in his name# username4 ...*\r\n" +
        "    By default the gamemode is standard, if you want to choose another mode, type m=1 or m=2 or m=3 at the end of the command.\r\n" +
        "    Standard = 0, osu!taiko = 1, osu!catch = 2, osu!mania = 3\r\n" +
        "    Example for an osu!catch ranking: *!topsetup \"Gods\" ExGon #Touch Me# Motion m=2*\r\n\r\n" +
        "**!top** -- Show the ranking --> *!top NameOfTheTop*\r\n" +
        "**!topscore** -- Show the score ranking --> *!topscore NameOfTheTop*\r\n" +
        "**!topadd** -- Add players to your top --> *!topadd \"NameOfTheTop\" username1 username2 ...*\r\n" +
        "**!toprm** -- Remove players from your top --> *!toprm \"NameOfTheTop\" username1 username2 ...*\r\n"+
        "**!toplist** -- Show the list of the rankings set up in your Discord server\r\n" +
        "**!topdelete** -- Delete one of your server's rankings --> *!topdelete NameOfTheTop*\r\n" +
        "**!track** -- Track automatically changes in a ranking --> *!track NameOfTheTop*\r\n\r\n" +
        " -------- **Other commands unrelated to the ranking** -------- \r\n" +
        "For these commands, you have to use usernames containing spaces without delimiting them with \"#\"\r\n"+
        "By default, the gamemode is standard, if you don't use m= at the end of the command.\r\n" +
        "**!profile** -- Show profile information of a player in the desired mode --> Example: *!profile nathan on osu*\r\n" +
        "**!best** -- Show the player's five best performances in the desired mode\r\n" +
        "For the following command, please don't use the gamemode selection:\r\n" +
        "**!profilelink** -- Show the link of the player's profile --> *!profilelink username*\r\n" +
        "**!profilepic** -- Show the player's profile picture on osu! --> *!profilepic username*\r\n\r\n");
}
