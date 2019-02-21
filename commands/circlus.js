exports.run = (bot, message) => {
    message.reply("\r\nList of commands I can perform:\r\n\r\n**!topsetup** -- Setup a ranking this way --> !topsetup \"NameOfTheTop\" Player1 " +
        "Player2 #Player with spaces in his name# Player4\r\n   If you want to chose another mode than standard, type m=1/2/3 at the end of the command\r\n" +
        "   Standard = 0, osu!taiko = 1, osu!catch = 2, osu!mania = 3\r\n" +
        "   Example for an osu!catch ranking: !topsetup \"Gods\" ExGon #Touch Me# Motion m=2" +
        "\r\n\r\n**!top** -- Show your ranking this way --> !top NameOfTheTop\r\n" +
        "**!toplist** -- Show the list of the rankings set up in the Discord server\r\n" +
        "**!topdelete** -- Delete one of your server's rankings --> !topdelete NameOfTheTop\r\n" +
        "**!info** -- Show profile information of a player in the desired mode --> Example: !info ExGon m=2\r\n" +
        "**!rank** -- Show the player's rank --> !rank player\r\n" +
        "**!profilelink** -- Show the link of the player's profile --> !profilelink player\r\n" +
        "**!profilepic** -- Show the player's profile picture on osu! --> !profilepic player");
}
