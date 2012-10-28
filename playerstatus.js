playerstatus = (function() {

// Each target here is passed to fetch.php to perform our cross-domain requests
var TARGETS = [{'src': 'http://crawl.develz.org/cgi-bin/dgl-status/index.html',
                'tag': 'CDO/Term'},
               {'src': 'http://crawl.develz.org/cgi-bin/web-status/index.html',
                'tag': 'CDO/Web'},
               {'src': 'http://crawl.akrasiac.org/cgi-bin/dgl-status/index.html',
                'tag': 'CAO/Both'},
               {'src': 'http://dobrazupa.org/cgi-bin/dgl-status',
                'tag': 'CßO/Both'},
               {'src': 'http://crawlus.somatika.net/status',
                'tag': 'CSN/Web'}];
// "[Watch]" links are automatically added for all targets with entries here
var WATCH_URLS = {'CDO/Web': 'https://tiles.crawl.develz.org/#watch-',
                  'CAO/Both': 'http://crawl.akrasiac.org:8080/#watch-',
                  'CßO/Both': 'https://crawl.s-z.org/#watch-',
                  'CSN/Web': 'http://crawlus.somatika.net:8080/#watch-'};
// Enum for each column in the table
var PLAYER  = 0,
    VER     = 1,
    GAME    = 2,
    XL      = 3,
    SP      = 4,
    BG      = 5,
    PLACE   = 6,
    IDLE    = 7,
    VIEWERS = 8,
    SERVER  = 9;
// In the "Player" column, truncate any names longer than this
var MAX_NAME_LEN = 13;
// Milliseconds between data reload
var RELOAD_INTERVAL = 30000;

// Entry point of our infinite loop, gets data from fetch.php
function fetchPlayerData() {
    var results = [];
    var requests = 0;

    $.each(TARGETS, function(i) {
        $.get('fetch.php', TARGETS[i], function(data) {
            // Throw away data if the page is broken or if no players are on
            if (isJSON(data, TARGETS[i])) {
                $.merge(results, JSON.parse(data));
            }

            // These GETs are all async. Proceed only once they're all finished
            requests += 1;
            if (requests === TARGETS.length) {
                formatData(results);
            }
        });
    });
}

// Gussy up our raw data
function formatData(data) {
    // When the user-selected sort criteria cannot order two elements,
    // tablesorter falls back to ordering them via their initial order in the
    // table. Here we establish that initial order by sorting on player name.
    data.sort(function(a, b) {
        return a[PLAYER].toLowerCase() < b[PLAYER].toLowerCase() ? -1 : 1;
    });

    var fmtdata = $.extend(true, [], data);  // Recursively copy the array
    // Each array in `data` looks like this:
    //  Player      Ver   Game   XL   Sp   Bg   Place     Idle  Vwr Server
    // ["DrPraetor","git","dcss","10","Op","EE","Volcano","722","0","CAO/Term"]
    $.each(data, function(i1) {
        fmtdata[i1][PLAYER] = formatPlayer(data[i1]);  // Link to player page
        fmtdata[i1][IDLE] = formatIdle(data[i1]);  // Turn seconds into 00:00
        fmtdata[i1][VIEWERS] = formatViewers(data[i1]);  // Link to watch page
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
    var sortOrder = [[VIEWERS, 1]];
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
    tsOptions.headers[PLACE] = {sorter: 'place'};
    tsOptions.headers[VIEWERS] = {sorter: 'viewers'};
    $('#statustable').tablesorter(tsOptions);

    // Do it all over again every 30 secs
    setTimeout(fetchPlayerData, RELOAD_INTERVAL);
}

// Add link to the CAO player page and truncate names longer than MAX_NAME_LEN
function formatPlayer(datum) {
    return '<a target="_blank"' +
           ' href="http://crawl.akrasiac.org/scoring/players/' +
           datum[PLAYER].toLowerCase() +
           '">' +
           (datum[PLAYER].length > MAX_NAME_LEN
            ? datum[PLAYER].substring(0, MAX_NAME_LEN-1) + '…'
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

// Add an entry to the WATCH_URLS object to automatically add new [Watch] links
function formatViewers(datum) {
    if (WATCH_URLS[datum[SERVER]] !== undefined) {
        return datum[VIEWERS] +
               '&nbsp;[' +
               '<a target="_blank" href="' +
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
