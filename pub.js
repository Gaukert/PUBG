(function() {
    function _getJSON(url){
        var HttpRequest = Packages.com.gmt2001.HttpRequest;
        var HashMap = Packages.java.util.HashMap;
        var h = new HashMap();
        h.put('TRN-Api-Key', '9af80dfa-ea6c-452b-88ac-081dd017b52f');
        var responseData = HttpRequest.getData(HttpRequest.RequestType.GET, encodeURI(url), '', h);
        return responseData.content;
    }
    function getRanks(json) {
        var stats = json.Stats;
        var results = {};
        for (i in stats) {
            var t = stats[i].Match;
            var r = {};
            lstats = stats[i].Stats
            for (k in lstats) {
                r[lstats[k].label] = lstats[k];
            }
            results[t] = r;
        }
        return results;
    }
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    $.bind('command', function(event) {


        var sender = event.getSender(),
            command = event.getCommand(),
            args = event.getArgs(),
            username = args[0] === undefined ? undefined : String(args[0]),
            statsType = args[1] === undefined ? undefined : String(args[1]),
            allowedTypes = ['solo', 'duo', 'squad'],
            region = args[2] === undefined ? undefined : String(args[2]),
            // 2nd check needs to be implemented.
            allowedTypes2 = ['eu','na','as','oc','sa','sea'];

        if (command.equalsIgnoreCase('pubg')) {
            // Check arguments


                if (username === undefined || (statsType !== undefined && allowedTypes.indexOf(statsType) === -1)) {
                $.say('usage: !pubg <username> [' + allowedTypes.join('|') + ']');
                return;
            }

            // Get JSON and parse stats
            var json = JSON.parse(_getJSON("https://pubgtracker.com/api/profile/pc/" + username + "?region=" + region));
            var stats = getRanks(json);

            // Decide which stats types to print
            var displayTypes;
            if (statsType === undefined) {
                displayTypes = allowedTypes;
            } else {
                displayTypes = [statsType];
            }

            // Iterate over stats types and add formatted string to output
            var output = '';
            displayTypes.forEach(function(type) {
                output += capitalizeFirstLetter(type) + ': ' +
                          'Rank #' + stats[type]['Rating']['rank'] +
                          ' with ' + stats[type]['Rating']['displayValue'] + ' points. ';
            });

            $.say(output);
        }
    });
    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./custom/pub.js')) {
            $.registerChatCommand('./custom/pub.js', 'pubg', 6);
        }
    });
})();
