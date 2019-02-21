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

module.exports = {
    secondsToHms, precise, getMode, getModPic
}
