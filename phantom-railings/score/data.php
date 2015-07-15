
<?php
# Output the cached file
$fileName = "data/data.txt";

if(!is_writable($fileName)){
  // print an error
  print "The file $fileName is not writable";
  // exit the function
  exit;
} else {
  // echo the contents of the file
  echo( file_get_contents($fileName) ); 
}

include_once( 'update_data.php');

?>