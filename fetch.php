<?php
$src = $_GET['src'];  // Target URL
$tag = $_GET['tag'];  // Server ID

$data = file_get_contents($src);

/*
The dgl-status output that we receive looks like this:

blackcustard#dcss-svn#L12 SpAs, Lair:1#80x24#2230#0#
Disco#dcss-svn#L1  TeAE, D:1#80x24#31#0#
elliptic#dcss-svn#L24 MuEn, Elf:5#80x24#1#3#
ZChris13#spr-svn##80x24#1730#0#

We want to transform it in the following ways:
1. Insert the server tag at the end of each record.
2. Split out the third field into four subfields.
3. Transform each server's idiosyncratic game/version identifiers (found in
   field 2) into a more uniform representation.
4. Split out the game/version identifiers into two fields.
5. Get rid of the termsize field.
6. Remove the L from the XL field.

This will yield a string that is still easily parseable. If we're careful, and
if we know the characteristics of the dgl-status output, we can do this with
string replacement and regexes. This is hilariously fragile! If only the
servers could respond in JSON, using standardized formats... but such is life.
*/

// We'll use | as our record delimiter as it won't appear in the dgl output.
$data = str_replace("\n", ($tag . '|'), $data);
// Field three represents four data points: xl, race, role, and place.
$data = str_replace("#Lost in Time#", "#?#?#?#?#", $data);  // Ancient crawl
$data = str_replace(", ", "#", $data);  // ", " separates char and place
$data = str_replace("  ", " ", $data);  // If two spaces delimit xl and char
$data = str_replace(" ", "#", $data);  // The space between xl and char
$pattern = "/#(L\d{1,2})#([a-zA-Z]{2})([a-zA-Z]{2})#/";
$replacement = "#$1#$2#$3#";
$data = preg_replace($pattern, $replacement, $data);  // char -> race#role
$data = str_replace("##", "#####", $data);  // If field three was totally blank
// If only servers could agree on compact, uniform game/version names...
$data = str_replace("#dc-anc#", "#dcss-old#", $data);  // Ancient crawl
$data = str_replace("-web-trunk", "-git", $data);  // CSN
$data = str_replace("-svn", "-git", $data);  // CDO
$data = str_replace("#Crawl-", "#dcss-", $data);  // CAO
$data = str_replace("#Sprint-", "#spr-", $data);  // CAO
$data = str_replace("#sprint-", "#spr-", $data);  // CSN
$data = str_replace("#ZD-", "#zd-", $data);  // CAO
// CDO sends us "spr-0.8" but we want "0.8-spr"
$pattern = "/#(dcss|spr|zd|tut)-([\d\.a-zA-Z]{3,4})#/";
$replacement = "#$2#$1#";
$data = preg_replace($pattern, $replacement, $data);
// We hate termsize!
$pattern = "/#\d{1,3}x\d{1,3}#/";
$replacement = "#";
$data = preg_replace($pattern, $replacement, $data);
// And we hate that L in front of the XL field! We're mad with regex power.
$pattern = "/#L(\d{1,2})#/";
$replacement = "#$1#";
$data = preg_replace($pattern, $replacement, $data);
// Bonus round
$data = str_replace("#Shoals:", "#Shoal:", $data);
$data = str_replace("#Spider:", "#Spidr:", $data);
$data = substr($data, 0, strlen($data)-1);  // Chop off the last pipe character

/*
So now we have something that looks like this:

Chapayev#0.9#dcss#12#Na#VM#Lair:6#51#0#CAO/Term|crate#git#dcss#3#OgBe#D:2#0#0#CAO/Term|demonblade#git##dcss###1915#0#CAO/Term

Let's transform it into JSON.
*/

$data = str_replace('#', '","', $data);
$data = str_replace('|', '"],["', $data);
$data = '[["' . $data . '"]]';

/*
In the event that we can't connect to the remote data source, $data will end up
as '[[""]]' and PHP may or may not decide to echo an error message (there is no
way to prevent this behavior, as far as I know, short of reconfiguring PHP). If
it echoes an error message, the client will catch the error when it attempts to
parse invalid JSON, so no harm. If it doesn't echo an error message, we'd
rather return an empty string (and thereby also trigger a failure in the
parser) rather than return an empty JSON array. We'd love it if PHP could be
guaranteed to not insert garbage into its responses, but such is life.
*/
if ($data == '[[""]]') { $data = ''; }

echo $data;
?>
