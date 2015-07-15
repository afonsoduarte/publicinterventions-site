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
  if(intval($_GET['file']) > 4 && intval($_GET['file']) < 26) $file = intval($_GET['file']);
} // provide default value 
else {
  $file = 5;
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
  <script type="text/javascript" src="raphael.js"></script>
  <link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
  <script>

    // CONSTANTS

    // Paper size: 0.24 x 3.6
    // Paper ratio:

    var paperRatio = 230/(3600 * 2),
        paperWidth = 2300,
        paddingLeft = 120,
        paddingRight = 100,
        notWorkingSensors = [],//[4,5,6,7,10,11,14,15,16,20,21,23,28,30,31,32,36,38,40,41,45,46,49,50],
        refactoredIds = [],
        timeDivider = 200,
        //time = - (Data[0][0]/timeDivider),
        time = 0, 
        baseline = 100, // line every 10px, 2 second
        gridSize = 6000, // blue line every 120 seconds
        scale = 6,
        timeToSkip = 43200000,
        paperHeight = 36000 * 2,
        dayOfTheMonth = <?php echo $file ?>,
        timeStampLabelFrequency = 5, // print time every 10 minutes
        projectLabelFrequency = 10, // print time every 20 minutes
        timeStampIncrement = 10;
  
    <?php 
    // Hacky fix for dance performance: Timestamps are absolute, rather than relative to last
    if($file >23) : ?>
      Data= [ 
        [<?php echo $lines[0][0]; ?>,<?php echo $lines[0][1]; ?>,<?php echo $lines[0][2]; ?>],
      <?php for ($i = 1; $i < count($lines); $i++): ?>
        [<?php echo ($lines[$i][0] - $lines[$i-1][0]); ?>,<?php echo $lines[$i][1]; ?>,<?php echo $lines[$i][2]; ?>],
        <?php 

          if($lines[$i][0] < $min_a) $min_a = $lines[$i][0];

          if($lines[$i][1] > $max_b) $max_b = $lines[$i][1];
          if($lines[$i][1] < $min_b) $min_b = $lines[$i][1];

          if($lines[$i][2] > $max_c) $max_c = $lines[$i][2];
          if($lines[$i][2] < $min_c) $min_c = $lines[$i][2];

        ?>
      <?php endfor;  ?>
      ];

      // Redefine some constants
      timeToSkip = 0;
      paperHeight = 36000 * 2;
      timeDivider = 20;
      baseline = 10; // line every 10px, 2 second
      gridSize = 600; // blue line every 120 seconds
      scale = 6;
      
      dayOfTheMonth = 31;
      timeStampLabelFrequency = 5;
      projectLabelFrequency = 5;
      timeStampIncrement = 2;


    <?php else: ?>
      Data= [ 
      <?php for ($i = 0; $i < count($lines); $i++): ?>
        [<?php echo $lines[$i][0]; ?>,<?php echo $lines[$i][1]; ?>,<?php echo $lines[$i][2]; ?>],
        <?php 

          if($lines[$i][0] < $min_a) $min_a = $lines[$i][0];

          if($lines[$i][1] > $max_b) $max_b = $lines[$i][1];
          if($lines[$i][1] < $min_b) $min_b = $lines[$i][1];

          if($lines[$i][2] > $max_c) $max_c = $lines[$i][2];
          if($lines[$i][2] < $min_c) $min_c = $lines[$i][2];

        ?>
      <?php endfor;  ?>
      ];
    <?php endif; ?>


    // Variables from PHP
    var timeMin = <?php echo $min_a ?>,
        timeMax = <?php echo $max_a ?>,
        idMin = <?php echo $min_b ?>,
        idMax = <?php echo $max_b ?>,
        soundMin = <?php echo $min_c ?>,
        soundMax = <?php echo $max_c ?>;
        // date = new Date("October "+dayOfTheMonth+", 2012 11:50:00"),
    
    date = new Date("October 31, 2013 13:00:00");

    <?php if ($file === 25): ?>
    date = new Date("October 31, 2013 14:00:00");
    <?php endif; ?> 


/**
 * Array.prototype.[method name] allows you to define/overwrite an objects method
 * needle is the item you are searching for
 * this is a special variable that refers to "this" instance of an Array.
 * returns true if needle is in the array, and false otherwise
 */
Array.prototype.contains = function ( needle ) {
   for (i in this) {
       if (this[i] == needle) return true;
   }
   return false;
}

// Pad minutes
Date.prototype.getMinutesTwoDigits = function()
{
    var retval = this.getMinutes();
    if (retval < 10)
    {
        return ("0" + retval.toString());
    }
    else
    {
        return retval.toString();
    }
}


// Creates canvas 1200 × 600 at 10, 50
var paper = Raphael(0, 0, paperWidth, paperHeight);

// Create Time grid
for(var i = 0, j = -1; i < (paperHeight/baseline); i++) {

  var y = i * baseline; 

  if(i % (gridSize/baseline) === 0 ){ //dark line for 1 min
    var x = 0,
        col = "rgba(0, 0, 0, 1)" ;

    j++;

    if(j % timeStampLabelFrequency === 0) { // print time every 10 minutes

      console.log(j, timeStampLabelFrequency);

      date.setMinutes(date.getMinutes() + timeStampIncrement);

      paper
        .text(50 / scale, (y + 30)/scale, date.getHours() +":"+ date.getMinutesTwoDigits() )
        .attr( "font-family", 'StempelSchneidler, StempelSchneidlerW01-Medium')
        .attr("font-size", 40/scale);

      if(j % projectLabelFrequency === 0) { //print every 20 minutes
        paper
          .text( (paperWidth - 50)/scale, (y-500)/scale, "Phantom Railings, Malet Street Gardens, "+ dayOfTheMonth +" October 2013" )
          .attr( "font-family", 'StempelSchneidler, StempelSchneidlerW01-Medium')
          .attr("font-size", 40/scale)
          .transform("r270")
          ;
      }
    }

  } else { // grey line for 10 seconds
    var x = paddingLeft - 15,
        col = "rgba(0, 0, 0, 0.2)";
  }

  paper
    .path("M"+x/scale+" "+y/scale+"H"+(paperWidth - paddingRight)/scale)
      .attr("stroke", col )
      .attr("stroke-width", .5);

}

// skip broken sensors
for(var i = 1; i <= idMax; i++) {
  var skip = false;

  for(j in notWorkingSensors) {
    if (notWorkingSensors[j] === i) { 
      skip = true;
    }
  }
  if(!skip) refactoredIds.push(i); 
}

// Draw score
for(var i = 0; i < Data.length; i++) {

  time += Data[i][0];

  switch (i) {
    case 19:
      timeToSkip = 43200000 - (1000 * 60 * 60 * 2); 
      break;
    case 21:
      timeToSkip = 43200000 - (1000 * 60 * 60 * 6);
      break;
    default:
      timeToSkip = 43200000;
      break;
  }

  <?php if($file >23) : ?> timeToSkip = 0; <?php endif; ?>

  //Start at noon
  // if( time < timeToSkip ) continue;
    
    var id = refactoredIds.indexOf(Data[i][1]),
        x = ((paperWidth-20-paddingLeft-paddingRight)/refactoredIds.length) * (id + 1) + (paddingLeft), // 
        y = (Data[i][0] + time - timeToSkip)/timeDivider,
        r = (Data[i][2] / 1.9) + 2,
        // col = "hsl("+(Data[i][2]*4)/100+", 0.5, 0.5)"; //COLOUR
        col = "hsl(1, 0, "+(Data[i][2] * 2)/100 +")"; //B&W

    // Stop after reaching the bottom of the paper
    if( y > paperHeight) break;

    // Creates circle (x, y, radius)
    paper.circle( x/scale, y/scale, r/scale)    
        // Sets the fill attribute of the circle to red (#f00)
        .attr( "fill",  col)

        // Sets the stroke attribute of the circle to white
        .attr("stroke", col)

        // Sets text
        .data({"col": col ,"id": Data[i][1], "y": y, "i": i, "r": r})
        .click(function () {
          console.log(this.data("col"), this.data("id"), this.data("y"), this.data("i"), this.data("r"));
        });

    // Line
    // paper
    //   .path("M0 "+y+"H"+paperWidth)
    //     .attr("stroke", "rgba(0, 0, 0, 0.5)")
    //     .attr("stroke-width", 1);
}

</script>
</body>
</html>