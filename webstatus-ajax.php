<?php
$data = FetchData("http://crawl.develz.org/cgi-bin/dgl-status/index.html");
$data = str_replace("\n", "CDO-DGL|", $data);

$data = $data . FetchData("http://crawl.develz.org/cgi-bin/web-status/index.html");
$data = str_replace("\n", "CDO-Web|", $data);

$data = str_replace(", ", "#", $data);
$data = str_replace("  ", " ", $data);
$data = str_replace(" ", "#", $data);
$data = str_replace("##", "####", $data);
$data = str_replace("#Shoals:", "#Shoal:", $data);
$data = str_replace("#dcss-web-", "#", $data);
$data = str_replace("#dcss-", "#", $data);
$data = str_replace("#Crawl-", "#", $data);
$data = str_replace("#svn", "#git", $data);
$data = str_replace("#spr-0.8", "#0.8-spr", $data);
$data = str_replace("#zd-0.8", "#0.8-zd", $data);

echo substr($data,0,strlen($data)-1);

function FetchData($url)
{
$ret = "";
$crl = curl_init();
$timeout = 5;
curl_setopt ($crl, CURLOPT_URL,$url);
curl_setopt ($crl, CURLOPT_RETURNTRANSFER, 1);
curl_setopt ($crl, CURLOPT_CONNECTTIMEOUT, $timeout);
$ret = curl_exec($crl);
curl_close($crl);

return $ret;
}
?>