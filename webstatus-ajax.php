<?php
$url="http://crawl.develz.org/cgi-bin/dgl-status/index.html";
$crl = curl_init();
$timeout = 5;
curl_setopt ($crl, CURLOPT_URL,$url);
curl_setopt ($crl, CURLOPT_RETURNTRANSFER, 1);
curl_setopt ($crl, CURLOPT_CONNECTTIMEOUT, $timeout);
$ret = curl_exec($crl);
curl_close($crl);

$ret = str_replace("\n", "CDO|", $ret);
$ret = str_replace(", ", "#", $ret);
$ret = str_replace("  ", " ", $ret);
$ret = str_replace(" ", "#", $ret);
$ret = str_replace("##", "####", $ret);

echo substr($ret,0,strlen($ret)-1);
?>