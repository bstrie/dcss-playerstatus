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
    SP = 4,
    BG = 5,
    PLACE = 6,
    IDLE = 7,
    VIEWERS = 8,
    SERVER = 9;

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
    // When the user-selected sort criteria cannot order two elements,
    // tablesorter falls back to ordering them via their initial order in the
    // table. Here we establish that initial order by sorting on player name.
    data.sort(function(a, b) {
        return a[0].toLowerCase() < b[0].toLowerCase() ? -1 : 1;
    });

    var fmtdata = $.extend(true, [], data);  // Recursively copy the array
    // Each array in `data` looks like this:
    //  Player      Ver   Game   XL   Sp   Bg   Place     Idle  Vwr Server
    // ["DrPraetor","git","dcss","10","Op","EE","Volcano","722","0","CAO/Term"]
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
                          '<th>Sp</th>' +
                          '<th>Bg</th>' +
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
    var sortOrder = [[0,0]];
    // Remember our sort order across updates
    if ($('#statustable').length > 0 && $('#statustable')[0].config) {
       sortOrder = $('#statustable')[0].config.sortList;
    }

    $('#playerstatus').html(tablehtml);

    // Need to make sure there's room for the sort icons.
    // Kludgy, but the best way to ensure a certain width for each th,
    // since width in ex/em is insufficient and px will vary by font.
    $('#statustable th').each(function() {
        $(this).text($(this).text() + '\u00A0\u00A0')
    });

    var tsOptions = {sortList: sortOrder, headers: {}};
    tsOptions.headers[PLACE] = {sorter: 'place'};
    tsOptions.headers[VIEWERS] = {sorter: 'viewers'};
    $('#statustable').tablesorter(tsOptions);

    // Do it all over again every 30 secs
    setTimeout(fetchPlayerData, 30000);
}

// Add a link to the CAO player page and truncate displayed name to 13 chars
function formatPlayer(datum) {
    return '<a href="' +
           'http://crawl.akrasiac.org/scoring/players/' +
           datum[PLAYER].toLowerCase() +
           '">' +
           (datum[PLAYER].length > 13 ? datum[PLAYER].substring(0,12) + '…'
                                      : datum[PLAYER]) +
           '</a>';
}

// Idle time is received as elapsed seconds, so we put it in 00:00 format.
// Sorting assumes no idle time greater than 99:99 (server should d/c by then)
function formatIdle(datum) {
    var minutes = Math.floor(datum[IDLE] / 60);
    var seconds = datum[IDLE] % 60;

    // Rarely the server won't d/c a super-idler and will increment forever.
    // Return infinity rather than a useless enormous number.
    if (minutes > 99) return '99:99';  // Or return '∞' if you feel frisky

    if (minutes < 10) minutes = '0' + minutes;
    if (seconds < 10) seconds = '0' + seconds;

    return minutes + ':' + seconds;
}

// Add an entry to the WATCH_URLS variable to automatically add new Watch links
function formatViewers(datum) {
    if (WATCH_URLS[datum[SERVER]] !== undefined) {
        return datum[VIEWERS] +
               '&nbsp;[' +
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
    // Custom parsers for sorting the "Viewers" and "Place" columns
    // For "Viewers", strip off the "[Watch]" link
    $.tablesorter.addParser({
        id: 'viewers',
        is: function(s) { return false; },
        format: function(s) { return parseInt(s.split(' ')[0]); },
        type: 'numeric'
    });
    // For "Place", sort "D:2" before "D:10"
    $.tablesorter.addParser({
        id: 'place',
        is: function(s) { return false; },
        format: function(s) {
            if (s.length === 3 && s.substring(0,2) === 'D:') {
                return s.substring(0,2) + '0' + s[2];
            }
            else {
                return s;
            }
        },
        type: 'text'
    });
    fetchPlayerData();  // Initiate the loop
});

})();
