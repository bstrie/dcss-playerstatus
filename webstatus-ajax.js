/* CREDITS (GENIUSES)
   doy
   eevee
*/

PlayerStatus = (function() {
  'use strict';
  var external = {};
  
  // constants
  var ACTUALLY_FALSE = 0; // because booleans in javascript are lies
  var ACTUALLY_TRUE = 1;  // booleans = lies
  var FIELD_SEPARATOR = "#"; // separates fields within player entries
  var ENTRY_SEPARATOR = "|"; // separates player entries
  var COUNTDOWN_INTERVAL = 3000; // delay between timer updates
  var TIMER_LENGTH = 24; // the number of characters in the timer
  var TIMER_QUANTUM = 2; // number of chars in the timer that change with each update
  var CAO_PLAYER_URL = "http://crawl.akrasiac.org/scoring/players/"; // generates link to player page
  var WEBTILES_SERVER_NAME = "CDO/Web"; // determines if a game is watchable
  var WEBTILES_URL = "https://tiles.crawl.develz.org/#watch-"; // generates link to watch webtiles games

  // control variables
  var is_offline = false;
  var game_data = []; // stores table data
  var sort_category = "Player"; // default sorting column
  var countdown_timer = TIMER_LENGTH; // initial length of countdown timer
  var splash_screen = ACTUALLY_TRUE; // determines where to write "Loading games..."
  var sort_reversed = ACTUALLY_FALSE; // whether the sorting column is sorted in reverse
  var timer = null; // the timer object
  var timer_is_on = ACTUALLY_FALSE; // determines whether the timer is active

  var MakeRequest = function ()
  {
    // determines whether to show "Loading games..." in the table area or below
    if(splash_screen)
    {
      // "ajax-response" is the name of the div where the table goes
      document.getElementById("ajax-response").innerHTML = "Loading games...";
      splash_screen = ACTUALLY_FALSE; // don't use booleans, they are lies
    }
    else
    {
      // "players" is the name of the td that normally shows the number of players
      document.getElementById("players-upper").innerHTML = "Loading games...";
      document.getElementById("players-lower").innerHTML = "Loading games...";
    }

    // zero the array that holds all the table data
    game_data = [{Player: "Yredelemnul", Version: "4.1", XL: "28", Char: "OMTh", Place: "Zot:27", Term: " ", Idle: "0", Viewers: "2", Server: "DCO"}];

    if(is_offline === ACTUALLY_FALSE)
    {
      /* begin ajax shenanigans */
      var xmlHttp = getXMLHttp();

      xmlHttp.onreadystatechange = function()
      {
        if(xmlHttp.readyState === 4)
        {
          HandleResponse(xmlHttp.responseText);
        }
      };

      xmlHttp.open("GET", "webstatus-ajax.php", true);
      xmlHttp.send(null);
    }
    else // if is_offline is true, bypass the ajax shenanigans
    {
      var fake_response;
      fake_response = "Tester1#0.2#03#JkL4#D:5#80x24#75#7#CAO|" +
                      "Tester2#0.3#04#MnO5#D:6#80x24#90#1#CDO/DGL|" +
                      "Tester3#0.4#05#PqR6#D:7#80x24#0#2#CDO/Web|" +
                      "Tester4#0.5#06#StU7#D:1#80x24#15#3#CAO|" +
                      "Tester5#0.6#07#AbC1#D:2#80x24#30#4#CDO/DGL|" +
                      "Tester6#0.7#01#DeF2#D:3#80x24#45#5#CDO/Web|" +
                      "Tester7#0.1#02#GhI3#D:4#80x24#60#6#CAO";
                      
      //pause = setTimeout("HandleResponse(fake_response)", COUNTDOWN_INTERVAL);
      HandleResponse(fake_response);
    }
  };

  var getXMLHttp = function()
  {
    var xmlHttp;

    try
    {
      //Firefox, Opera 8.0+, Safari
      xmlHttp = new XMLHttpRequest();
    }
    catch(e1)
    {
      //Internet Explorer
      try
      {
        xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
      }
      catch(e2)
      {
        try
        {
          xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        catch(e3)
        {
          alert("Your browser does not support AJAX!");
          return false;
        }
      }
    }

    return xmlHttp;
  };
  /* end ajax shenanigans */
  
  var HandleResponse = function(response) // response is the string returned by ajax/php
  {
    // debug(response); // uncomment this to see the raw php output
    var split_response = [];

    split_response = response.split(ENTRY_SEPARATOR); // "|" denotes divisions between entries

    var game; // holds all data for a single game

    // populate the table data array
    for(var i = 0; i < (split_response.length); i++)
    {
      game = split_response[i].split(FIELD_SEPARATOR); // "#" denotes divisions between fields

      // game object has the following properties: Player (player name), XL
      // (experience level), Char (character combo), Place (place in the dungeon),
      // Term (terminal size), Idle (idle time), Viewers (number of viewers),
      // Server (where each game is being played)
      game_data[i]={Player: game[0], Version: game[1], XL: ParseXL(game[2]), Char: game[3], Place: game[4], Term: game[5], Idle: game[6], Viewers: game[7], Server: game[8]};
    }

    SortData(); // put the data in order according to sort_category
    timer = setTimeout("PlayerStatus.Countdown()", COUNTDOWN_INTERVAL); // begin the countdown-to-refresh timer
    timer_is_on = ACTUALLY_TRUE; // note that the timer is running
  };

  // used to make the XL align and sort properly
  var ParseXL = function(raw_xl)
  {
    var xl;

    xl = raw_xl.slice(1);

    if((xl.length) === 1)
    {
      xl = "&nbsp;" + xl;
    }
    
    return xl;
  };

  // put the data in order according to the global variable sort_category
  // ugh, it's so hacky and slow, gotta redo this at some point
  // TODO: maybe generate sort strings once and then persist them
  var SortData = function()
  {
    var sort_keys = new Array();

    var game;

    var key;

    for(var i = 0; i < (game_data.length); i++) // loops for each game in table
    {
      game = game_data[i];
      // example of what key might look like, for sort_category "XL":
      // 27#elliptic#git#CDO-DGL|4
      // the name of the player, version of the game, and server of the game
      // are used as a fallback sort for when the sort category returns a match
      // the player name, version, and server form the unique key
      // the 4 denotes the position in the original unsorted array
      key = FudgeNumbers(game[sort_category]) + FIELD_SEPARATOR + game["Player"] + FIELD_SEPARATOR + game["Version"] + FIELD_SEPARATOR + game["Server"] + ENTRY_SEPARATOR + i;

      // put all the keys in an array
      sort_keys[i] = key.toLowerCase(); // sorting is case-sensitive
    }

    sort_keys.sort(); // built-in javascript sorting function

    // sort_keys now represents the table data in order

    var index;

    var sorted_games = new Array();

    for(var i = 0; i < (sort_keys.length); i++) // loop for each key
    {
      // retrieve the location of the current element in the unsorted array
      index = sort_keys[i].split(ENTRY_SEPARATOR)[1];
      sorted_games[i] = game_data[index]; // move the element
    }

    game_data = sorted_games; // reassign the table data array

    // this condition is only true when the user has sorted a column in reverse
    // and then allows the table to refresh automatically
    if(sort_reversed)
    {
      game_data = game_data.reverse();
    }
    
    CreateTable(); // create the table!
  };

  // the sorting algorithm can't be numeric, so "Idle" property (which is saved as
  // raw seconds) has to be fudged to make it sort properly
  var FudgeNumbers = function(value)
  {
    if(sort_category === "Idle")
    {
      switch(value.length)
      {
      case 1:
        value = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + value;
        break;

      case 2:
        value = "&nbsp;&nbsp;&nbsp;&nbsp;" + value;
        break;

      case 3:
        value = "&nbsp;&nbsp;&nbsp;" + value;
        break;

      case 4:
        value = "&nbsp;&nbsp;" + value;
        break;

      case 5:
        value = "&nbsp;" + value;
        break;
        
      default:
        break;
      }
    }
    return value;
  };

  // create the html table that holds all the table data
  var CreateTable = function()
  {
    // "data-table" is what is overwritten when the countdown timer elapses
    var table_string = "<table id='container-table'><tr id='status-row-upper' onclick='PlayerStatus.ReloadTable();' onmousedown='return false;' onselectstart='return false;'><td id='players-upper'>" + (game_data.length) + " game" + (game_data.length===1 ? "" : "s") + " in progress</td><td id='timer-upper'></td></tr><tr><td colspan=2><table id='data-table'><tr>";

    // get the names of the categories, defined as object properties
    var game = game_data[0];

    for(var i in game)
    {
      if(i === sort_category) // visual cue for the current sort category
      {
        table_string += "<th class='sort' onmousedown='return false;' onselectstart='return false;' onclick='PlayerStatus.SortCategories(\"" + i + "\")'>" + i + "</th>";
      }
      else if(!(i === "Term")) // we don't want to see the term category
      {
        // "onmousedown='return false;' onselectstart='return false;'
        // keep the header text from being highlightable
        table_string += "<th onmousedown='return false;' onselectstart='return false;' onclick='PlayerStatus.SortCategories(\"" + i + "\")'>" + i + "</th>";
      }
    }

    table_string += "</tr>";

    game = "";

    var player_name;

    // put the data into the table
    for(var i = 0; i < (game_data.length); i++)
    {
      game = game_data[i];

      if(i % 2 === 0)
      {
        table_string += "<tr class='norm'>"; // even rows are darker
      }
      else
      {
        table_string += "<tr class='alt'>"; // odd rows are lighter
      }

      for(var j in game)
      {
        // we want the player's name to be a link to their scoring page
        if(j === "Player")
        {
          player_name = game[j];
          // link to their CAO scoring page
          table_string += "<td>" + player_name.link(CAO_PLAYER_URL + player_name.toLowerCase() + ".html") + "</td>";
        }
        // the idle string is stored as seconds, we want to put it in ##:## format
        else if(j === "Idle")
        {
          table_string += "<td>" + convertIdle(game[j]) + "</td>";
        }
        // if playing webtiles, we want to add a link to watch the game
        else if(j === "Viewers" && game["Server"] === WEBTILES_SERVER_NAME)
        {
          table_string += "<td>" + game[j] + " (" + "Watch".link(WEBTILES_URL + player_name.toLowerCase()) + ")</td>";
        }
        // we don't want to see the term column
        else if(!(j === "Term"))
        {
          table_string += "<td>" + game[j] + "</td>";
        }
      }
      table_string += "</tr>";
    }
    // close off the table and add the lower table
    // clicking this lower table reloads the upper table
    // two fields: "players" shows the number of games being played,
    // "timer" shows the countdown timer
    table_string += "</table></td></tr><tr id='status-row-lower' onclick='PlayerStatus.ReloadTable();' onmousedown='return false;' onselectstart='return false;'><td id='players-lower'>" + (game_data.length) + " game" + (game_data.length===1 ? "" : "s") + " in progress</td><td id='timer-lower'></td></tr></table>";

    // push the defined table to the page
    document.getElementById('ajax-response').innerHTML = table_string;

    // begin to update the countdown timer
    DrawCountdownTimer();
  };

  // idle time is passed as pure seconds, we want it in 00:00 format
  var convertIdle = function(seconds)
  {
    var idle_string = "";
    
    // if less than a minute, draw it as 00:xx or 00:0x
    if(seconds < 60)
    {
      if(seconds < 10)
      {
        idle_string = "00:0" + seconds;
      }
      else
      {
        idle_string = "00:" + seconds;
      }
    }
    else
    {
      var minutes = Math.floor(seconds/60);

      seconds = seconds % 60;

      if(seconds < 10)
      {
        seconds = "0" + seconds;
      }

      if(minutes < 10)
      {
        minutes = "0" + minutes;
      }
      idle_string = minutes + ":" + seconds;
    }
    return idle_string;
  };

  // timer is redrawn every COUNTDOWN_INTERVAL ms

  var DrawCountdownTimer = function()
  {
    var timer_string = "<span class='blue'>"; // colors text blue

    // if TIMER_QUANTUM = 2, every COUNTDOWN_INTERVAL the timer will have
    // two fewer = signs
    for(var i = 0; i < countdown_timer; i+=TIMER_QUANTUM)
    {
      for(var j = 0; j < TIMER_QUANTUM; j++)
      {
        timer_string += "=";
      }
    }

    timer_string += "</span>";

    if(countdown_timer <= TIMER_LENGTH - TIMER_QUANTUM)
    {
      timer_string += "<span class='purple'>--</span>";
    }

    if(countdown_timer <= TIMER_LENGTH - (TIMER_QUANTUM * 2))
    {
      timer_string += "<span class='grey'>";

      for(var i = countdown_timer; i < TIMER_LENGTH - TIMER_QUANTUM; i+=TIMER_QUANTUM)
      {
        for(var j = 0; j < TIMER_QUANTUM; j++)
        {
          timer_string += "-";
        }
      }
      timer_string += "</span>";
    }

    document.getElementById('timer-upper').innerHTML = timer_string;
    document.getElementById('timer-lower').innerHTML = timer_string;
  };

  // var Countdown = function()
  // {
    // timer_is_on = ACTUALLY_FALSE;

    // if(countdown_timer > 1)
    // {
      // countdown_timer -= TIMER_QUANTUM;
      // DrawCountdownTimer();
      // timer = setTimeout("PlayerStatus.Countdown()", COUNTDOWN_INTERVAL);
      // timer_is_on = ACTUALLY_TRUE;
    // }
    // else
    // {
      // ReloadTable();
    // }
  // };

  var debug = function(message)
  {
    document.getElementById('debug').innerHTML = message;
  };

  var debugDate = function()
  {
    var d = new Date();
    document.getElementById('debug').innerHTML = d;
  };

  // var ReloadTable = function()
  // {
    // countdown_timer = TIMER_LENGTH;

    // if(timer_is_on)
    // {
      // clearTimeout(timer);
    // }

    // MakeRequest();
  // };

  external.init = function(offline)
  {
    is_offline = offline;
    MakeRequest();
  };
  
  // if the column to be sorted is the column that is already sorted,
  // re-sort it in the opposite order.
  external.SortCategories = function(new_category)
  {
    // new_category is the category the user has clicked
    // sort_category is the caregory currently determining sort order
    if(sort_category === new_category)
    {
      // sort_reversed is our global variable to determine the sort order
      if(sort_reversed)
      {
        sort_reversed = ACTUALLY_FALSE; // booleans are lies
      }
      else
      {
        sort_reversed = ACTUALLY_TRUE; // lies
      }
      
      game_data = game_data.reverse(); // don't need to bother re-sorting
      CreateTable();
    }
    else
    {
      sort_reversed = ACTUALLY_FALSE; // lies
      sort_category = new_category;
      SortData(); // proprietary sort method called "terrible slowsort"
    }
  };
  
  external.Countdown = function()
  {
    timer_is_on = ACTUALLY_FALSE;

    if(countdown_timer > 1)
    {
      countdown_timer -= TIMER_QUANTUM;
      DrawCountdownTimer();
      timer = setTimeout("PlayerStatus.Countdown()", COUNTDOWN_INTERVAL);
      timer_is_on = ACTUALLY_TRUE;
    }
    else
    {
      PlayerStatus.ReloadTable();
    }
  };
  
  external.ReloadTable = function()
  {
    countdown_timer = TIMER_LENGTH;

    if(timer_is_on)
    {
      clearTimeout(timer);
    }

    MakeRequest();
  };

  return external;

})();