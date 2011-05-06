function MakeRequest()
{
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
    game_data[i]={Player: game[0], Version: game[1], XL: game[2], Char: game[3], Location: game[4], Term: game[5], Idle: game[6], View: game[7], Server: game[8]};
  }
  
  CreateTable();
}

function CreateTable()
{
  var table_string = "<table id='data-table'><tr>";
  
  game = game_data[0];
  
  for(i in game)
  {
    if(i == sort_category)
    {
      table_string += "<th class='sort'>" + i + "</td>";
    }
    else
    {
      table_string += "<th>" + i + "</td>";
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
      table_string += "<tr>";
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
  
  table_string += "</table><table><tr><td>" + (game_data.length) + " game" + (game_data.length==1 ? "" : "s") + " in progress</td><td id='timer'><span class='blue'>====================</span><span class='purple'>-</span><span class='grey'>---</span></td></tr></table>";
  
  document.getElementById('ajax-response').innerHTML = table_string;
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