<?php 

# when called, this file opens the relevant feed and reads 
# the current values of all the data
# and then deletes the oldest line

sleep(1);

require_once( 'PachubeAPI.php' );

# *****************************************************************
#
# Create a Pachube object and pass your API key
#
# *****************************************************************

$api_key = "znLMn4MFYehq5R34m3Zh7Tk3VrGSAKxxSWY4MDRZRCtHND0g";
$pachube = new PachubeAPI($api_key);

# *****************************************************************
#
# retrieve Pachube feed data
#
# *****************************************************************

$feed = 59421;
$data = $pachube->getFeedData ( $feed, "csv" );

$fileName = "data/data.txt";

if(!is_writable($fileName)){
  // print an error
  print "The file $fileName is not writable";
  // exit the function
  exit;
} else {
  // read the file into an array    
  $arr = file($fileName); 
}

if (sizeof($arr) >= 59){
  //remove the line
  unset($arr[0]);
}

$fp = fopen($fileName, 'w+');
if (!$fp){
  // print an error
  print "Cannot open file ($fileName)";
  // exit the function
  exit;
}

else {

  foreach($arr as $line) { 
    fwrite($fp,$line); 
  }
      
  //add the new data to the end of the file
  fwrite($fp, $data);
  fwrite($fp, "\n");

  // close the file
  fclose($fp);
}

?>