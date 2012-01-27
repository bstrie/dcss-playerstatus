var dbg;
var PLAYER = 0, 
    VER = 1,
    GAME = 2,
    XL = 3,
    CHAR = 4,
    PLACE = 5,
    IDLE = 6,
    VIEWERS = 7,
    SERVER = 8; 

function fetchData() {
    var urls = [{'src': 'http://crawl.develz.org/cgi-bin/dgl-status/index.html',
                 'tag': 'CDO/DGL'},
                {'src': 'http://crawl.develz.org/cgi-bin/web-status/index.html',
                 'tag': 'CDO/Web'},
                {'src': 'http://crawl.akrasiac.org/cgi-bin/dgl-status/index.html',
                 'tag': 'CAO/DGL'}];
    var results = '[';
    var requests = 0;

    $.each(urls, function(url) {
        $.get('fetch.php', urls[url], function(data) {
            results += data;
            requests += 1;

            if (requests === urls.length) {
                results += ']';
                formatData(JSON.parse(results));
            }
            else {
                results += ',';
            }
        });
    });
}

function formatData(data) {
    data.sort(function(a, b) {
        return a[0].toLowerCase() < b[0].toLowerCase() ? -1 : 1;
    });
    dbg = data;

    var fmtdata = $.extend(true, [], data);  // Recursively copy the array
    // Each array in data looks like this:
    //  Player      Ver   Game   XL   Char   Place     Idle  Vwr Server
    // ["DrPraetor","git","dcss","10","OpEE","Volcano","722","0","CAO/DGL"]
    for (var i1=0; i1<data.length; i1++) {
        fmtdata[i1][PLAYER] = formatPlayer(data[i1]);
        fmtdata[i1][IDLE] = formatIdle(data[i1]);
        fmtdata[i1][VIEWERS] = formatViewers(data[i1]);
    }

    drawTable(fmtdata);
}

function drawTable(data) {
    var tablehtml = data.length + ' games in progress' +
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
                    '</tr></thead><tbody>';

    for (var i1=0; i1<data.length; i1++) {
        tablehtml += '<tr>';
        for (var i2=0; i2<data[i1].length; i2++) {
            tablehtml += '<td>' + data[i1][i2] + '</td>';
        }
        tablehtml += '</tr>';
    }

    tablehtml += '</tbody></table>';

    $('#playerstatus').html(tablehtml);
    // Kludgy, but the best way to ensure a certain width for each th,
    // since width in ex/em is insufficient and px will vary by font.
    $('#statustable th').each(function() { 
        $(this).text($(this).text() + '\u00A0\u00A0')
    });
    $.tablesorter.addParser({
        id: 'viewers',
        is: function(s) { return false; },
        format: function(s) {
            return parseInt(s.split(' ')[0]);
        },
        type: 'numeric'
    });
    $('#statustable').tablesorter({
        // Sort on the first column, ascending
        sortList: [[0,0]],
        headers: {7: {sorter: 'viewers'}}
    });
}

function formatPlayer(datum) {
    return '<a href="' +
           'http://crawl.akrasiac.org/scoring/players/' +
           datum[PLAYER].toLowerCase() +
           '">' +
           datum[PLAYER] +
           '</a>';
}

function formatIdle(datum) {
    var seconds = datum[IDLE];
    var minutes;

    minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;

    if (minutes < 10) minutes = '0' + minutes;
    if (seconds < 10) seconds = '0' + seconds;
 
    return minutes + ':' + seconds;
}

function formatViewers(datum) {
    if (datum[SERVER] === 'CDO/Web') {
        return datum[VIEWERS] +
               ' [' +
               '<a href="' +
               'https://tiles.crawl.develz.org/#watch-' +
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

$(document).ready(function() {
    $('#playerstatus').text('Retrieving data');
    fetchData();
});
