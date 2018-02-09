<?php

header('Access-Control-Allow-Origin: *');

$environment = 'live';    // or 'beta-sandbox' or 'live'
 
/**
* Send HTTP POST Request
*
* @param    string    The API method name
* @param    string    The POST Message fields in &name=value pair format
* @return    array    Parsed HTTP Response body
*/
function PPHttpPost($methodName_, $nvpStr_) {
    global $environment;
 
    $API_UserName = urlencode('[API USERNAME]');
    $API_Password = urlencode('[API PASSWORD]');
    $API_Signature = urlencode('[API SIGNATURE]');
    $API_Endpoint = "https://api-3t.paypal.com/nvp";
    if("sandbox" === $environment || "beta-sandbox" === $environment) {
        $API_Endpoint = "https://api-3t.$environment.paypal.com/nvp";
    }
    $version = urlencode('51.0');
 
    // setting the curl parameters.
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $API_Endpoint);
    curl_setopt($ch, CURLOPT_VERBOSE, 1);
 
    // turning off the server and peer verification(TrustManager Concept).
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
 
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, 1);
 
    // NVPRequest for submitting to server
    $nvpreq = "METHOD=$methodName_&VERSION=$version&PWD=$API_Password&USER=$API_UserName&SIGNATURE=$API_Signature$nvpStr_";
 
    // setting the nvpreq as POST FIELD to curl
    curl_setopt($ch, CURLOPT_POSTFIELDS, $nvpreq);
 
    // getting response from server
    $httpResponse = curl_exec($ch);
 
    if(!$httpResponse) {
        exit("$methodName_ failed: ".curl_error($ch).'('.curl_errno($ch).')');
    }
 
    // Extract the RefundTransaction response details
    $httpResponseAr = explode("&", $httpResponse);
 
    $httpParsedResponseAr = array();
    foreach ($httpResponseAr as $i => $value) {
        $tmpAr = explode("=", urldecode($value));
        if(sizeof($tmpAr) > 1) {
            $httpParsedResponseAr[$tmpAr[0]] = $tmpAr[1];
        }
    }
 
    if((0 == sizeof($httpParsedResponseAr)) || !array_key_exists('ACK', $httpParsedResponseAr)) {
        exit("Invalid HTTP Response for POST request($nvpreq) to $API_Endpoint.");
    }
 
    return $httpParsedResponseAr;
}
 
$nvpStr="";
 
$httpParsedResponseAr = PPHttpPost('GetBalance', $nvpStr);
 
if("SUCCESS" == strtoupper($httpParsedResponseAr["ACK"]) || "SUCCESSWITHWARNING" == strtoupper($httpParsedResponseAr["ACK"])) {
    echo json_encode($httpParsedResponseAr);
} else  {
    exit('GetBalance failed: ' . print_r($httpParsedResponseAr, true));
}
 
?>
