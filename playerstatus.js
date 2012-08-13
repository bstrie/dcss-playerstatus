playerstatus = (function() {

var TARGETS = [{'src': 'http://crawl.develz.org/cgi-bin/dgl-status/index.html',
                'tag': 'CDO/Term'},
               {'src': 'http://crawl.develz.org/cgi-bin/web-status/index.html',
                'tag': 'CDO/Web'},
               {'src': 'http://crawl.akrasiac.org/cgi-bin/dgl-status/index.html',
                'tag': 'CAO/Term'},
               {'src': 'http://dobrazupa.org/cgi-bin/dgl-status',
                'tag': 'CßO/Both'},
               {'src': 'http://crawlus.somatika.net/status',
                'tag': 'CSN/Web'}];
var WATCH_URLS = {'CDO/Web': 'https://tiles.crawl.develz.org/#watch-',
                  'CßO/Both': 'https://crawl.s-z.org/#watch-',
                  'CSN/Web': 'http://crawlus.somatika.net:8080/#watch-'};
var PLAYER = 0,
    VER = 1,
    GAME = 2,
    XL = 3,
    CHAR = 4,
    PLACE = 5,
    IDLE = 6,
    VIEWERS = 7,
    SERVER = 8;

function fetchPlayerData() {
    var results = [];
    var requests = 0;

    $.each(TARGETS, function(i) {
        $.get('fetch.php', TARGETS[i], function(data) {
            if (isJSON(data, TARGETS[i])) {
                $.merge(results, JSON.parse(data));
            }

            // These GETs are async. Proceed only once they're all finished
            requests += 1;
            if (requests === TARGETS.length) {
                formatData(results);
            }
        });
    });
}

function formatData(data) {
    // Sort by player name
    data.sort(function(a, b) {
        return a[0].toLowerCase() < b[0].toLowerCase() ? -1 : 1;
    });

    var fmtdata = $.extend(true, [], data);  // Recursively copy the array
    // Each array in `data` looks like this:
    //  Player      Ver   Game   XL   Char   Place     Idle  Vwr Server
    // ["DrPraetor","git","dcss","10","OpEE","Volcano","722","0","CAO/Term"]
    for (var i1=0; i1<data.length; i1++) {
        fmtdata[i1][PLAYER] = formatPlayer(data[i1]);  // Link to player page
        fmtdata[i1][IDLE] = formatIdle(data[i1]);  // Turn seconds into 00:00
        fmtdata[i1][VIEWERS] = formatViewers(data[i1]);  // Link to watch page
    }

    drawTable(fmtdata);
}

function drawTable(data) {
    var tablehtml = '<span id="games">' +
                      data.length + ' games in progress' +
                    '</span>' +
                    '<span id="tip">' +
                      'Tip: shift-click on column headings ' +
                      'to sort by multiple columns at once.' +
                    '</span>' +
                      '<table id="statustable" class="tablesorter">' +
                        '<thead><tr>' +
                          '<th>Player</th>' +
                          '<th>Ver</th>' +
                          '<th>Game</th>' +
                          '<th>XL</th>' +
                          '<th>Char</th>' +
                          '<th>Place</th>' +
                          '<th>Idle</th>' +
                          '<th>Viewers</th>' +
                          '<th>Server</th>' +
                        '</tr></thead>' +
                        '<tbody>';

    // Each row of the table body
    for (var i1=0; i1<data.length; i1++) {
        tablehtml += '<tr>';
        // Each column
        for (var i2=0; i2<data[i1].length; i2++) {
            tablehtml += '<td>' + data[i1][i2] + '</td>';
        }
        tablehtml += '</tr>';
    }

    tablehtml += '</tbody></table>';

    // By default, sort on first column (player name)
    var sort = [[0,0]];
    // Remember our sort order across updates
    if ($('#statustable').length > 0 && $('#statustable')[0].config) {
       sort = $('#statustable')[0].config.sortList;
    }

    $('#playerstatus').html(tablehtml);

    // Need to make sure there's room for the sort icons.
    // Kludgy, but the best way to ensure a certain width for each th,
    // since width in ex/em is insufficient and px will vary by font.
    $('#statustable th').each(function() {
        $(this).text($(this).text() + '\u00A0\u00A0')
    });

    $('#statustable').tablesorter({
        sortList: sort,
        headers: {7: {sorter: 'viewers'}}  // Sort Viewers with custom parser
    });

    // Do it all over again every 30 secs
    setTimeout(fetchPlayerData, 30000);
}

function formatPlayer(datum) {
    return '<a href="' +
           'http://crawl.akrasiac.org/scoring/players/' +
           datum[PLAYER].toLowerCase() +
           '">' +
           datum[PLAYER] +
           '</a>';
}

// Idle time is received as elapsed seconds, so we put it in 00:00 format.
// Sorting assumes no idle time greater than 99:99 (server should d/c by then)
function formatIdle(datum) {
    var minutes = Math.floor(datum[IDLE] / 60);
    var seconds = datum[IDLE] % 60;

    if (minutes < 10) minutes = '0' + minutes;
    if (seconds < 10) seconds = '0' + seconds;

    return minutes + ':' + seconds;
}

// Add an entry to the WATCH_URLS variable to automatically add new Watch links
function formatViewers(datum) {
    if (WATCH_URLS[datum[SERVER]] !== undefined) {
        return datum[VIEWERS] +
               ' [' +
               '<a href="' +
               WATCH_URLS[datum[SERVER]] +
               datum[PLAYER].toLowerCase() +
               '">' +
               'Watch' +
               '</a>' +
               ']';
    }
    else {
        return datum[VIEWERS];
    }
}

// Returns false when a server has no players or when a status page is broken
function isJSON(str, target) {
    try {
        JSON.parse(str);
    } catch (e) {
        console.log(e);
        console.log('...while parsing data from ' + target['src'] +
                    ' (' + target['tag'] + ')');
        return false;
    }
    return true;
}

$(document).ready(function() {
    $('#playerstatus').text('Retrieving data');
    // A custom parser for sorting the "Viewers" column
    $.tablesorter.addParser({
        id: 'viewers',
        is: function(s) { return false; },
        format: function(s) { return parseInt(s.split(' ')[0]); },
        type: 'numeric'
    });
    fetchPlayerData();  // Initiate the loop
});

})();
