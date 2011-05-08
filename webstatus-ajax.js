function MakeRequest()
{
  if(splash_screen == true)
  {
    document.getElementById("ajax-response").innerHTML = "Loading games...";
    splash_screen = false;
  }
  else
  {
    document.getElementById("players").innerHTML = "Loading games...";
  }
  
  if(timer_is_on)
  {
    clearTimeout(t);
  }

  game_data = [{Player: "None", Version: "None", XL: "None", Char: "None", Place: "None", Term: "None", Idle: "None", View: "None", Server: "None"}];
  countdown_timer = 24;
  
  var xmlHttp = getXMLHttp();
 
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

function HandleResponse(response)
{
  var split_response = new Array();
  split_response = response.split("|");
  
  var game;
  
  for(i = 0; i < (split_response.length); i++)
  {
    game = split_response[i].split("#");
    game_data[i]={Player: game[0], Version: game[1], XL: ParseXL(game[2]), Char: game[3], Place: game[4], Term: game[5], Idle: game[6], View: game[7], Server: game[8]};
  }
  
  SortData();
  
  t = setTimeout("Countdown()",3000);
  timer_is_on = 1;
}

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

function SortData()
{
  var sort_keys = new Array();
  var game;
  var key;
  
  for(i = 0; i < (game_data.length); i++)
  {
    game = game_data[i];
    key = FudgeNumbers(game[sort_category]) + "#" + game["Player"] + "|" + i;
    sort_keys[i] = key.toLowerCase();
  }
  
  sort_keys.sort();
  
  var index;
  var sorted_games = new Array();
  
  for(i = 0; i < (sort_keys.length); i++)
  {
    index = sort_keys[i].split("|")[1]
    sorted_games[i] = game_data[index];
  }
  
  game_data = sorted_games;
  
  if(sort_reversed == true)
  {
    game_data = game_data.reverse();
  }
  
  //document.getElementById('debug').innerHTML = sorted_games[0].Player;
  
  CreateTable();
}

function FudgeNumbers(value)
{
  if(sort_category == "Idle" || sort_category == "Term")
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

function CreateTable()
{
  var table_string = "<table id='data-table'><tr class='headrow'>";
  
  game = game_data[0];
  
  for(i in game)
  {
    if(i == sort_category)
    {
      table_string += "<th onmousedown='return false;' onselectstart='return false;' class='sort' onclick='SortCategories(\"" + i + "\")'>" + i + "</td>";
    }
    else
    {
      table_string += "<th onmousedown='return false;' onselectstart='return false;' onclick='SortCategories(\"" + i + "\")'>" + i + "</td>";
    }
  }
  
  table_string += "</tr>";
  
  game = "";
  var player_name;
  
  for(i = 0; i < (game_data.length); i++)
  {
    game = game_data[i];
    
    if(i % 2 == 0)
    {
      table_string += "<tr class='norm'>";
    }
    else
    {
      table_string += "<tr class='alt'>";
    }
    
    for(j in game)
    {
      if(j == "Player")
      {
        player_name = game[j];
        table_string += "<td>" + player_name.link("http://crawl.akrasiac.org/scoring/players/" + player_name.toLowerCase() + ".html") + "</td>";
      }
      else if(j == "Idle")
      {
        table_string += "<td>" + convertIdle(game[j]).link("http://crawl.akrasiac.org/scoring/players/" + player_name.toLowerCase() + ".html") + "</td>";
      }
      else
      {
        table_string += "<td>" + game[j].link("http://crawl.akrasiac.org/scoring/players/" + player_name.toLowerCase() + ".html") + "</td>";
      }
    }
    
    table_string += "</tr>";
  }
  
  table_string += "</table><table><tr><td id='players' width=100%>" + (game_data.length) + " game" + (game_data.length==1 ? "" : "s") + " in progress</td><td id='timer' onclick='MakeRequest()'></td></tr></table>";
  
  document.getElementById('ajax-response').innerHTML = table_string;
  
  DrawCountdownTimer();
}

function SortCategories(new_category)
{
  if(sort_category == new_category)
  {
    if(sort_reversed)
    {
      sort_reversed = false;
    }
    else
    {
      sort_reversed = true;
    }
    
    game_data = game_data.reverse();
    CreateTable();
  }
  else
  {
    sort_reversed = false;
    sort_category = new_category;
    SortData();
  }
}

function convertIdle(seconds)
{
  var idle_string = "";
  
  if(seconds < 60)
  {
    idle_string = seconds + "s";
  }
  else
  {
    idle_string = Math.floor(seconds / 60) + "m " + (seconds % 60) + "s";
  }
  
  return idle_string;
}

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
  
  // switch(countdown_timer)
  // {
  // case 24:
    // timer_string = "<span class='blue'>========================</span>";
    // break;
  // case 22:
    // timer_string = "<span class='blue'>======================</span><span class='purple'>--</span>";
    // break;
  // case 20:
    // timer_string = "<span class='blue'>====================</span><span class='purple'>--</span><span class='grey'>--</span>";
    // break;
  // case 18:
    // timer_string = "<span class='blue'>==================</span><span class='purple'>--</span><span class='grey'>----</span>";
  // case 16:
    // timer_string = "<span class='blue'>================</span><span class='purple'>--</span><span class='grey'>------</span>";
    // break;
  // case 14:
    // timer_string = "<span class='blue'>==============</span><span class='purple'>--</span><span class='grey'>--------</span>";
    // break;
  // case 12:
    // timer_string = "<span class='blue'>============</span><span class='purple'>--</span><span class='grey'>----------</span>";
    // break;
  // case 10:
    // timer_string = "<span class='blue'>==========</span><span class='purple'>--</span><span class='grey'>------------</span>";
    // break;
  // case 8:
    // timer_string = "<span class='blue'>========</span><span class='purple'>--</span><span class='grey'>--------------</span>";
    // break;
  // case 6:
    // timer_string = "<span class='blue'>======</span><span class='purple'>--</span><span class='grey'>----------------</span>";
    // break;
  // case 4:
    // timer_string = "<span class='blue'>====</span><span class='purple'>--</span><span class='grey'>------------------</span>";
    // break;
  // case 2:
    // timer_string = "<span class='blue'>==</span><span class='purple'>--</span><span class='grey'>--------------------</span>";
    // break;
  // case 0:
    // timer_string = "<span class='purple'>--</span><span class='grey'>----------------------</span>";
    // break;
  // default:
    // break;
  // }

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
    MakeRequest();
  }
}

function debug(message)
{
  document.getElementById('debug').innerHTML = message;
}