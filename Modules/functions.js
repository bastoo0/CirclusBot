function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay;
}

function precise(x, p) {
    return Number.parseFloat(x).toPrecision(p);
}

function getMode(m) {
    switch (m) {
        case "1":
            return "osu!Taiko";
            break;
        case "2":
            return "osu!Catch";
            break;
        case "3":
            return "osu!Mania";
            break;
        default:
            return "osu!";
    }
}

function getModPic(num) {

    let Mods = [1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0];
    var ModFound = new Array();
    for (var i = 0; i < Mods.length; i++) {
        if (num >= Mods[i]) {
            num -= Mods[i];
            ModFound.push(Mods[i]);
        }
    }
    var linktab = new Array();
    var modname = "+";
    for (var i = 0; i < ModFound.length; i++) {
        let modlink = "https://osu.ppy.sh/images/badges/mods/mod_";

        switch (ModFound[i]) {
            case 1:
                modlink += "no-fail.png";
                modname += "NF";
                break;
            case 2:
                modlink += "easy.png";
                modname += "EZ";
                break;
            case 8:
                modlink += "hidden.png";
                modname += "HD";
                break;
            case 16:
                modlink += "hard-rock.png";
                modname += "HR";
                break;
            case 32:
                modlink += "sudden-death.png";
                modname += "SD";
                break;
            case 64:
                modlink += "double-time.png";
                modname += "DT";
                break;
            case 256:
                modlink += "half-time.png";
                modname += "HT";
                break;
            case 512:
                modlink += "nightcore.png";
                modname += "NC";
                break;
            case 1024:
                modlink += "flashlight.png";
                modname += "FL";
                break;
        }
        linktab.push(modlink);
    }
    return { linktab, modname };
}

function toparrays(command){

    let argsname = command.content.split(' '); // Splits the command in an array at each space 
    for (let i = 0; i < argsname.length; i++) { // Tests if there is any name with spaces (delimited by #)
        if (argsname[i].startsWith("#")) {
            while (!argsname[i].endsWith("#")) {
                argsname.splice(i, 1); // Remove any name delimited by #
            }
            argsname.splice(i, 1);
            i--;
        }
    }
    let temp = command.content.split('#');  // Add every name delimited with # in an array
    if (temp.length > 0) {
        for (let i = 0; i < temp.length; i++) { // This somehow removes all empty elements in the array
            temp.splice(i, 1);
        }
    }

    argsname.splice(0, 2); // Delete the first part of the command

    let argsmode = command.content.split('=');
    argsmode.shift();
    if (!argsmode[0]) {
        argsmode[0] = "1";
    } else argsname.pop(); // Delete the mode from argsname if exists

    if (temp.length > 0)
    argsname.push(...temp); // Add the array of "names with spaces" to the players array

    let topname = command.content.split('"'); // Find the name of the top
    topname.shift();
    topname.pop();

    return [
        topname,
        argsname,
        argsmode
    ];
}

module.exports = {
    secondsToHms, precise, getMode, getModPic, toparrays
}
