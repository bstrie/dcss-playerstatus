<?php
/* fetch the raw game data */
// first parameter is the address of the file
// second parameter is the string identifying the source of the data
// in the raw data, "#" separates fields and newlines separate entries
$data = FetchData("http://crawl.develz.org/cgi-bin/dgl-status/index.html", "CDO-DGL");
$data = $data . FetchData("http://crawl.develz.org/cgi-bin/web-status/index.html", "CDO-Web");

/* use simple find-and-replace to make the fetched game data more parseable
   fetched data must use "#" to separate fields and "|" to separate entries */
// first three lines turn the "where" category into "xl", "char", and "place"
$data = str_replace(", ", "#", $data); // ", " separates char and place
$data = str_replace("  ", " ", $data); // for alignment, sometimes two spaces separate xl and char
$data = str_replace(" ", "#", $data); // parses the space between xl and char
// if player is dead or starting a game, "where" field is blank
$data = str_replace("##", "####", $data); // dummy hashes for blank "where"
$data = str_replace("#Shoals:", "#Shoal:", $data); // make shoals shorter
$data = str_replace("#dcss-web-", "#", $data); // remove CDO tile version prefix
$data = str_replace("#dcss-", "#", $data); // remove CDO dgl version prefix
$data = str_replace("#Crawl-", "#", $data); // remove CAO prefix
$data = str_replace("#svn", "#git", $data); // standardize trunk version names
$data = str_replace("#spr-0.8", "#0.8-spr", $data); // sort sprint versions
$data = str_replace("#zd-0.8", "#0.8-zd", $data); // sort zot defense
$data = str_replace("#tut-0.8", "#0.8-tut", $data); // sort tutorials
$data = str_replace("#lorcs", "ero", $data); // better name for erocrawl

echo substr($data,0,strlen($data)-1); //return the final string

function FetchData($url, $tag)
{
$tag = $tag . "|"; // append the "|" that separates entries
$ret = ""; // initialize return value

/* begin ajax stuff */
$crl = curl_init();
$timeout = 5;
curl_setopt ($crl, CURLOPT_URL,$url);
curl_setopt ($crl, CURLOPT_RETURNTRANSFER, 1);
curl_setopt ($crl, CURLOPT_CONNECTTIMEOUT, $timeout);
$ret = curl_exec($crl);
curl_close($crl);
/* end ajax stuff */

$ret = str_replace("\n", $tag, $ret); // replace newlines with suffix + "|"

return $ret;
}
?>