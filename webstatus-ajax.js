// maybe remove Term category entirely, cut down on bandwidth and array size

function MakeRequest()
{
  // determines whether to show "Loading games..." in the table area or below
  if(splash_screen)
  {
    // "ajax-response" is the name of the div where the table goes
    document.getElementById("ajax-response").innerHTML = "Loading games...";
    splash_screen = 0; // don't use booleans, they are lies
  }
  else
  {
    // "players" is the name of the td that normally shows the number of players
    document.getElementById("players").innerHTML = "Loading games...";
  }

  // zero the array that holds all the table data
  game_data = [{Player: "Yredelemnul", Version: "4.1", XL: "28", Char: "OMTh", Place: "Zot:27", Term: " ", Idle: "0", Viewers: "2", Server: "DCO"}];
  
  /* begin ajax shenanigans */
  xmlHttp = getXMLHttp();
 
  xmlHttp.onreadystatechange = function()
  {
    if(xmlHttp.readyState == 4)
    {
      HandleResponse(xmlHttp.responseText);
    }
  }

  xmlHttp.open("GET", "webstatus-ajax.php", true);
  xmlHttp.send(null);
}

function getXMLHttp()
{
  var xmlHttp

  try
  {
    //Firefox, Opera 8.0+, Safari
    xmlHttp = new XMLHttpRequest();
  }
  catch(e)
  {
    //Internet Explorer
    try
    {
      xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
    }
    catch(e)
    {
      try
      {
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
      }
      catch(e)
      {
        alert("Your browser does not support AJAX!")
        return false;
      }
    }
  }
  return xmlHttp;
}
/* end ajax shenanigans */

function HandleResponse(response) // response is the string returned by ajax/php
{
  //debug(response); // uncomment this to see the raw php output

  var split_response = new Array();
  split_response = response.split("|"); // "|" denotes divisions between entries
  
  var game; // holds all data for a single game
  
  // populate the table data array
  for(i = 0; i < (split_response.length); i++)
  {
    game = split_response[i].split("#"); // "#" denotes divisions between fields
    // game object has the following properties: Player (player name), XL
    // (experience level), Char (character combo), Place (place in the dungeon),
    // Term (terminal size), Idle (idle time), Viewers (number of viewers),
    // Server (where each game is being played)
    game_data[i]={Player: game[0], Version: game[1], XL: ParseXL(game[2]), Char: game[3], Place: game[4], Term: game[5], Idle: game[6], Viewers: game[7], Server: game[8]};
  }
  
  SortData(); // put the data in order according to sort_category
  
  t = setTimeout("Countdown()",3000); // begin the countdown-to-refresh timer
  timer_is_on = 1; // note that the timer is running
}

// used to make the XL align and sort properly
function ParseXL(raw_xl)
{
  var xl;
  xl = raw_xl.slice(1);
  
  if((xl.length) == 1)
  {
    xl = "&nbsp;" + xl;
  }
  
  return xl;
}

// put the data in order according to the global variable sort_category
// ugh, it's so hacky and slow, gotta redo this at some point
function SortData()
{
  var sort_keys = new Array();
  var game;
  var key;
  
  for(i = 0; i < (game_data.length); i++) // loops for each game in table
  {
    game = game_data[i];
    // example of what key might look like, for sort_category "XL":
    // 27#elliptic#git#CDO-DGL|4
    // the name of the player, version of the game, and server of the game
    // are used as a fallback sort for when the sort category returns a match
    // the player name, version, and server form the unique key
    // the 4 denotes the position in the original unsorted array
    key = FudgeNumbers(game[sort_category]) + "#" + game["Player"] + "#" + game["Version"] + "#" + game["Server"] + "|" + i;
    
    // put all the keys in an array
    sort_keys[i] = key.toLowerCase(); // sorting is case-sensitive
  }
  
  sort_keys.sort(); // built-in javascript sorting function
  
  // sort_keys now represents the table data in order
  
  var index;
  var sorted_games = new Array();
  
  for(i = 0; i < (sort_keys.length); i++) // loop for each key
  {
    // retrieve the location of the current element in the unsorted array
    index = sort_keys[i].split("|")[1];
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
}

// the sorting algorithm can't be numeric, so "Idle" property (which is saved as
// raw seconds) has to be fudged to make it sort properly
function FudgeNumbers(value)
{
  if(sort_category == "Idle")
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
}

// create the html table that holds all the table data
function CreateTable()
{
  // "data-table" is what is overwritten when the countdown timer elapses
  var table_string = "<table id='container-table'><tr><td colspan=2><table id='data-table'><tr>";
  
  // get the names of the categories, defined as object properties
  game = game_data[0]; 
  
  for(i in game)
  {    
    if(i == sort_category) // visual cue for the current sort category
    {
      table_string += "<th class='sort' onmousedown='return false;' onselectstart='return false;' onclick='SortCategories(\"" + i + "\")'>" + i + "</th>";
    }
    else if(!(i == "Term")) // we don't want to see the term category
    {
      // "onmousedown='return false;' onselectstart='return false;'
      // keep the header text from being highlightable
      table_string += "<th onmousedown='return false;' onselectstart='return false;' onclick='SortCategories(\"" + i + "\")'>" + i + "</th>";
    }
  }
  
  table_string += "</tr>";
  
  game = "";
  var player_name;
  
  // put the data into the table
  for(i = 0; i < (game_data.length); i++)
  {
    game = game_data[i];
    
    if(i % 2 == 0)
    {
      table_string += "<tr class='norm'>"; // even rows are darker
    }
    else
    {
      table_string += "<tr class='alt'>"; // odd rows are lighter
    }
    
    for(j in game)
    {
      // we want the player's name to be a link to their scoring page
      if(j == "Player")
      {
        player_name = game[j];
        // link to their CAO scoring page
        table_string += "<td>" + player_name.link("http://crawl.akrasiac.org/scoring/players/" + player_name.toLowerCase() + ".html") + "</td>";
      }
      // the idle string is stored as seconds, we want to put it in ##:## format
      else if(j == "Idle")
      {
        table_string += "<td>" + convertIdle(game[j]) + "</td>";
      }
      // if playing webtiles, we want to add a link to watch the game
      else if(j == "Viewers" && game["Server"] == "CDO/Web")
      {
        table_string += "<td>" + game[j] + " (" + "Watch".link("https://tiles.crawl.develz.org/#watch-" + player_name.toLowerCase()) + ")</td>";
      }
      // we don't want to see the term column
      else if(!(j == "Term"))
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
  table_string += "</table></td></tr><tr id='status-row' onclick='ReloadTable();' onmousedown='return false;' onselectstart='return false;'><td id='players'>" + (game_data.length) + " game" + (game_data.length==1 ? "" : "s") + " in progress</td><td id='timer'></td></tr></table>";
  
  // push the defined table to the page
  document.getElementById('ajax-response').innerHTML = table_string;
  
  // begin to update the countdown timer
  DrawCountdownTimer();
}

// if the column to be sorted is the column that is already sorted,
// re-sort it in the opposite order.
function SortCategories(new_category)
{
  // new_category is the category the user has clicked
  // sort_category is the caregory currently determining sort order
  if(sort_category == new_category)
  {
    // sort_reversed is our global variable to determine the sort order
    if(sort_reversed)
    {
      sort_reversed = 0; // booleans are lies
    }
    else
    {
      sort_reversed = 1; // lies
    }
    
    game_data = game_data.reverse(); // don't need to bother re-sorting
    CreateTable();
  }
  else
  {
    sort_reversed = 0; // lies
    sort_category = new_category;
    SortData(); // proprietary sort method called "terrible slowsort"
  }
}

// idle time is passed as pure seconds, we want it in 00:00 format
function convertIdle(seconds)
{
  var idle_string = "";
  
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
    minutes = Math.floor(seconds/60);
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
}

// redrawn every
function DrawCountdownTimer()
{
  var timer_string = "<span class='blue'>";
  
  for(i = 0; i < countdown_timer; i+=2)
  {
    timer_string += "==";
  }
  
  timer_string += "</span>";
  
  if(countdown_timer <= 22)
  {
    timer_string += "<span class='purple'>--</span>";
  }
  
  if(countdown_timer <= 20)
  {
    timer_string += "<span class='grey'>";
  
    for(i = countdown_timer; i < 22; i+=2)
    {
      timer_string += "--";
    }
    
    timer_string += "</span>";
  }

  document.getElementById('timer').innerHTML = timer_string;
}

function Countdown()
{
  timer_is_on = 0;

  if(countdown_timer > 0)
  {
    countdown_timer -= 2;
    DrawCountdownTimer();
    t = setTimeout("Countdown()",3000);
    timer_is_on = 1;
  }
  else
  {
    ReloadTable();
  }
}

function debug(message)
{
  document.getElementById('debug').innerHTML = message;
}

function debugDate()
{
  var d = new Date();
  document.getElementById('debug').innerHTML = d;
}

function ReloadTable()
{
  countdown_timer = 24;
  
  if(timer_is_on)
  {
    clearTimeout(t);
  }
  
  MakeRequest();
}