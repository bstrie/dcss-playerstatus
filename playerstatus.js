// TODO: incrementally update table with data instead of blocking on receiving all responses

playerstatus = (function() {

// Add new hosts to this object
var SERVERS = {
    'CAO': {
        'data_url': 'http://crawl.akrasiac.org/cgi-bin/dgl-status/index.html',
        'watch_url': 'http://crawl.akrasiac.org:8080/#watch-',
    },
    'CDO': {
        'data_url': 'http://crawl.develz.org/cgi-bin/dgl-status/index.html',
        'watch_url': null,
    },
    'CSZO': {
        'data_url': 'http://dobrazupa.org/cgi-bin/dgl-status',
        'watch_url': 'https://crawl.s-z.org/#watch-',
    },
    /*'CLAN': {
        'data_url': 'http://crawl.lantea.net/cgi-bin/dgl-status',  // Times out from PHP?
        'watch_url': 'http://crawl.lantea.net:8080/#watch-',
    },*/
    'CBRO': {
        'data_url': 'http://crawl.berotato.org/cgi-bin/dgl-status',
        'watch_url': 'http://crawl.berotato.org:8080/#watch-',
    },
    /*'CKR': {
        'data_url': 'http://kr.dobrazupa.org/???',  // TODO
        'watch_url': 'http://kr.dobrazupa.org:8080/#watch-',
    },*/
    /*'LLD': {
        'data_url': 'http://lazy-life.ddo.jp/???',  // TODO
        'watch_url': '???',  // TODO
    },*/
    'CXC': {
        'data_url': 'http://crawl.xtahua.com/cgi-bin/dgl-status',
        'watch_url': 'http://crawl.xtahua.com:8080/#watch-',
    },
    /*'CPO': {
        'data_url': 'https://crawl.project357.org/???',  // TODO
        'watch_url': '???',  // TODO
    },*/
};

// Enum for each column in the table
var PLAYER_COL  = 0,
    VER_COL     = 1,
    GAME_COL    = 2,
    XL_COL      = 3,
    SP_COL      = 4,
    BG_COL      = 5,
    PLACE_COL   = 6,
    IDLE_COL    = 7,
    VIEWERS_COL = 8,
    SERVER_COL  = 9,
    NUM_COLUMNS = 10;  // This is as bad as Crawl code

// In the "Player" column, truncate any names longer than this
var MAX_NAME_LEN = 13;

// Milliseconds between data reload
var RELOAD_INTERVAL = 30000;

// Entry point of our infinite loop, gets data from fetch.php
function fetchPlayerData() {
    var results = [];
    var requests = 0;

    $.each(SERVERS, function(server) {
        $.get('fetch.php', {'server': server, 'data_url': SERVERS[server]['data_url']}, function(data) {
            // Throw away data if the page is broken or if no players are on
            if (isJSON(data, server)) {
                $.merge(results, JSON.parse(data));
            }

            // These GETs are all async. Proceed only once they're all finished
            // TODO: Promises
            requests += 1;
            if (requests === Object.keys(SERVERS).length) {
                formatData(results);
            }
        });
    });
}

// Gussy up our raw data
function formatData(data) {
    // Our terrible PHP-based dgl-status parser is easily confused,
    // especially by custom branch names that we did not expect.
    // A bold future of proper JSON responses awaits us.
    // But for the moment, we attempt to throw away bad data
    // with an imperfect sanity check.
    for (var idx=data.length-1; idx>0; idx--) {
        if (data[idx].length !== NUM_COLUMNS) {
            console.error("Row has an invalid number of columns:", data[idx]);
            data.splice(idx, 1);
        }
    }

    // When the user-selected sort criteria cannot order two elements,
    // tablesorter falls back to ordering them via their initial order in the
    // table. Here we establish that initial order by sorting on player name.
    data.sort(function(a, b) {
        return a[PLAYER_COL].toLowerCase() < b[PLAYER_COL].toLowerCase() ? -1 : 1;
    });

    var fmtdata = $.extend(true, [], data);  // Recursively copy the array
    // Each array in `data` looks like this:
    //  Player      Versn   Game   XL   Sp   Bg   Place     Idle  Vwr Server
    // ["DrPraetor","trunk","dcss","10","Op","EE","Volcano","722","0","CAO"]
    $.each(data, function(i1) {
        fmtdata[i1][PLAYER_COL] = formatPlayer(data[i1]);  // Link to player page
        fmtdata[i1][IDLE_COL] = formatIdle(data[i1]);  // Turn seconds into 00:00
        fmtdata[i1][VIEWERS_COL] = formatViewers(data[i1]);  // Link to watch page
    });

    drawTable(fmtdata);
}

function drawTable(data) {
    var tablehtml = '<span id="games">' +
                      data.length + ' games in progress' +
                    '</span>' +
                    '<span id="tip">' +
                      'Tip: shift-click on column headings ' +
                      'to sort by multiple columns at once' +
                    '</span>' +
                    '<table id="statustable" class="tablesorter">' +
                      '<thead><tr>' +
                        '<th>' +
                          'Player' +  // Keep this column at max name length
                          // Equivalent to `"mystring" * mynumber` in Python
                          // -6 for the length of "players"
                          // -2 for the spaces we tack on later
                          // +1 for terrible hacks
                          Array(MAX_NAME_LEN - 6 - 2 + 1).join('&nbsp;') +
                        '</th>' +
                        '<th>Versn</th>' +
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

    // Iterate over each row and cell
    $.each(data, function(i1) {
        tablehtml += '<tr>';
        $.each(data[i1], function(i2) {
            tablehtml += '<td>' + data[i1][i2] + '</td>';
        });
        tablehtml += '</tr>';
    });

    tablehtml += '</tbody></table>' +
                 '<span id="interval">' +
                   'Data updated every ' + RELOAD_INTERVAL/1000 + ' seconds' +
                 '</span>' +
                 '<span id="github">' +
                   '<a target="_blank"' +
                   ' href="https://github.com/bstrie/dcss-playerstatus/">' +
                     'Get the code for this app at Github' +
                   '</a>' +
                 '</span>';

    // By default, sort by "Viewers", descending
    var sortOrder = [[VIEWERS_COL, 1]];
    // Remember our sort order across updates
    if ($('#statustable').length > 0 && $('#statustable')[0].config) {
       sortOrder = $('#statustable')[0].config.sortList;
    }

    $('#playerstatus').html(tablehtml);

    // Append two &nbsp; to each th, to make sure there's room for the icons.
    // Kludgy, but it works well.
    $('#statustable th').each(function() {
        $(this).text($(this).text() + '\u00A0\u00A0')  // \u00A0 = &nbsp;
    });

    var tsOptions = {sortList: sortOrder, headers: {}};
    // Use our custom parsers to sort these columns
    tsOptions.headers[PLACE_COL] = {sorter: 'place'};
    tsOptions.headers[VIEWERS_COL] = {sorter: 'viewers'};
    $('#statustable').tablesorter(tsOptions);

    // Do it all over again every 30 secs
    setTimeout(fetchPlayerData, RELOAD_INTERVAL);
}

// Add link to the CAO player page and truncate names longer than MAX_NAME_LEN
function formatPlayer(datum) {
    return '<a target="_blank"' +
           ' href="http://crawl.akrasiac.org/scoring/players/' +
           datum[PLAYER_COL].toLowerCase() +
           '">' +
           (datum[PLAYER_COL].length > MAX_NAME_LEN
            ? datum[PLAYER_COL].substring(0, MAX_NAME_LEN-1) + '…'
            : datum[PLAYER_COL]) +
           '</a>';
}

// Idle time is received as elapsed seconds, so we put it in 00:00 format.
// Sorting assumes no idle time greater than 99:99 (server should d/c by then)
function formatIdle(datum) {
    var minutes = Math.floor(datum[IDLE_COL] / 60);
    var seconds = datum[IDLE_COL] % 60;

    // Rarely the server won't d/c a super-idler and will increment forever.
    // Return infinity rather than a useless enormous number.
    if (minutes > 99) return '99:99';  // Or return '∞' if you feel frisky

    if (minutes < 10) minutes = '0' + minutes;
    if (seconds < 10) seconds = '0' + seconds;

    return minutes + ':' + seconds;
}

// Adds a [Watch] link for servers that have them.
function formatViewers(datum) {
    var watch_url = SERVERS[datum[SERVER_COL]]['watch_url'];
    if (watch_url !== null) {
        return datum[VIEWERS_COL] +
               '&nbsp;[' +
               '<a target="_blank" href="' +
               watch_url +
               datum[PLAYER_COL].toLowerCase() +
               '">' +
               'Watch' +
               '</a>' +
               ']';
    }
    else {
        return datum[VIEWERS_COL];
    }
}

// Returns false when a server has no players or when a status page is broken
function isJSON(str, server) {
    try {
        JSON.parse(str);
    } catch (e) {
        console.error(e);
        console.error('...while parsing the following data:', str);
        console.error('...from ' + SERVERS[server]['data_url'] + ' (' + server + ')');
        return false;
    }
    return true;
}

// Begin execution
$(document).ready(function() {
    $('#playerstatus').text('Retrieving data');

    // Define custom parsers for sorting the "Viewers" and "Place" columns
    // For "Viewers", strip off the "[Watch]" link before sorting
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
            if (s.length === 3 && s.substring(0,2) === 'D:')
                return s.substring(0,2) + '0' + s[2];
            else
                return s;
        },
        type: 'text'
    });

    fetchPlayerData();  // Initiate the infinite loop
});

})();
