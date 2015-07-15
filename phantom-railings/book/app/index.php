<?php 

$lines = array();

$row = 0;

$max_a = 0;
$min_a = 10000;
$max_b = 0;
$min_b = 10000;
$max_c = 0;
$min_c = 10000;

$file = 4;

if($_GET['file']) {
  if(intval($_GET['file']) > 4 && intval($_GET['file']) < 21) $file = intval($_GET['file']);
}

if (($handle = fopen("csv/".$file.".csv", "r")) !== FALSE) {
  while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
    $lines[$row] = $data;
    $row++;
  }
  fclose($handle);
}

?>

<html>
<head>
  <meta charset="utf-8">
  <title>Phantom Railings</title>
  <script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/raphael/2.1.0/raphael-min.js"></script>
</head>
<body>
  <script>
  Data= [
<?php for ($i = 0; $i < count($lines); $i++): ?>
  [<?php echo $lines[$i][0]; ?>,<?php echo $lines[$i][1]; ?>,<?php echo $lines[$i][2]; ?>],
  <?php 

    if($lines[$i][0] > $max_a) $max_a = $lines[$i][0];
    if($lines[$i][0] < $min_a) $min_a = $lines[$i][0];

    if($lines[$i][1] > $max_b) $max_b = $lines[$i][1];
    if($lines[$i][1] < $min_b) $min_b = $lines[$i][1];

    if($lines[$i][2] > $max_c) $max_c = $lines[$i][2];
    if($lines[$i][2] < $min_c) $min_c = $lines[$i][2];

  ?>
<?php endfor;  ?>
];

  timeMin = <?php echo $min_a ?>;
  timeMax = <?php echo $max_a ?>;
  idMin = <?php echo $min_b ?>;
  idMax = <?php echo $max_b ?>;
  soundMin = <?php echo $min_c ?>;
  soundMax = <?php echo $max_c ?>;
</script>
<script>

var paperWidth = 1200,
    paperHeight = 200000,
    time = - (Data[0][0]/50);

// Creates canvas 1200 × 600 at 10, 50
var paper = Raphael(0, 0, paperWidth, paperHeight);

for(var i = 0; i < Data.length; i++) {
    
    var x = ((paperWidth-20)/idMax) * Data[i][1],
        y = (Data[i][0]/50) + time,
        r = Data[i][2]/2,
        col = "hsl("+(Data[i][2]*4)/100+", 0.5, 0.5)";

    time = y;

    console.log(time);

    // Creates circle (x, y, radius)
    paper.circle( x, y, r)    
        // Sets the fill attribute of the circle to red (#f00)
        .attr( "fill",  col)

        // Sets the stroke attribute of the circle to white
        .attr("stroke", col)

        // Sets text
        .data("col", col)
             .click(function () {
                console.log(this.data("col"));
             });
}



</script>
</body>
</html>