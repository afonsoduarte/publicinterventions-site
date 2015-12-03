var $ = jQuery  = require('jquery');
var throttle    = require('jquery-throttle-debounce');

ScoreScroll = function() {

  var that = this;

  this.init = function() {
    that.drawScore();
    $(window).bind( 'scroll', throttle.Cowboy.throttle( 200, that.scoreScrollAnimation ) );
    // $(window).bind('scroll', that.scoreScrollAnimation);
  }

  this.drawScore = function() {
    // CONSTANTS

    // Precision constant to divide Y position by
    window.precision = 10;

    // Paper size: 21cm x 27cm
    // Minus top and bottom margin: 16.6 x 27 cm
    // Paper ratio: 0.6148148148
    // I've converted the spread height to 2000, for easier divisions.
    // Therefore, width needs to be 2000 * 0.6148148148 ~= 1230

    var paperWidth = 1475,
        paperHeight = 2400 * 15,
        paperRatio = paperWidth/paperHeight,
        paddingLeft = 0, 
        paddingRight = 0,
        notWorkingSensors = [],//[4,5,6,7,10,11,14,15,16,20,21,23,28,30,31,32,36,38,40,41,45,46,49,50],
        refactoredIds = [],
        time = 0, 

        // 45 s in a page
        // 1m30s in a spread
        // line every 15s (4 big lines per spread)
        // 8 spreads total

        timeToSkip = 0,
        timeDivider = 55000, //20,
        baseline = 20, // line every 33px, ie, 1 sec
        gridSize = 400, // 6 big lines per spread: 2400/6 = 400
        gridOffset = 200; // push big lines to middle of page
        scale = 1, //1.915,
        
        dayOfTheMonth = 31,
        timeStampLabelFrequency = 5,
        projectLabelFrequency = 5,
        timeStampIncrement = 2,

        dots = [],
        dotsByY = [],
        dotsByYRounded = [];

    // Variables from PHP
    var idMax = 53,
        date = new Date("October 31, 2013 14:00:00");

    // Creates canvas 
    window.paper = Raphael("raphael-score");
    paper.setViewBox(0,0,paperWidth,paperHeight,true);
    paper.setSize('100%', '100%');

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
    var temp_max = Data.length;
    for(var i = 0; i < temp_max ; i++) {
      // For relative timestamps
      // time += Data[i][0];

      // For absolute timestamps
      time += Data[i][0] - Data[0][0];

      timeToSkip = Data[280][0] ; //120000; 
      // Skip the beginning, start at dot 280
      if( Data[i][0] > timeToSkip ) {

        if(i < 300) {
          console.log(time, timeToSkip);
        }
        
        var id = refactoredIds.indexOf(Data[i][1]),
            padding = 0,
            x = ((paperWidth-20-paddingLeft-paddingRight)/refactoredIds.length) * (id + 1) + (paddingLeft), // 
            y = Math.round((Data[i][0] + time - timeToSkip)/timeDivider) + padding,
            time = time,
            r = (Data[i][2] / 2.5) + 4,
            // col = "hsl("+(Data[i][2]*4)/100+", 0.5, 0.5)"; //COLOUR
            // col = "hsl(1, 0, "+(Data[i][2] * 2)/100 +")"; //B&W
            fill = "#000"; //url(../assets/fill-2.svg)",
            col = "none"; // "#000"; // Just black, we differentiate with patterns

        // first item has an absolute first value
        if(i === 0) y = Math.round((Data[i][0] - timeToSkip)/timeDivider);

        // console.log(i, Data[i][0], time, timeToSkip, timeDivider, y, paperHeight);

        // Stop after reaching the bottom of the paper
        if( y > paperHeight) break;

        // Creates circle (x, y, radius)
        paper.circle( x/scale, y/scale, r/scale)    
            // Sets the fill attribute of the circle to red (#f00)
            .attr( "fill",  fill)

            // Sets the stroke attribute of the circle to white
            .attr("stroke", col)

            // Sets text
            .data({"col": col ,"id": Data[i][1], "timestamp": Data[i][0], "x": x, "y": y, "i": i, "r": r, "time": time/1000 })
            .click(function (e) {
              console.log(this.data());
            })
            ;


        // Store data in object for fast search
        dotObj = {"id": i, "xid": Data[i][1], "r": r};
        dotsByY[y] = dotObj;

        roundedY = Math.round(y/precision);

        // Check if array has already been created
        if( !dotsByYRounded[roundedY] ) {
          dotsByYRounded[roundedY] = [];
        }
        dotsByYRounded[roundedY].push(dotObj);

        // Since paper resizes to fit width, we need to 
        // find its resize ratio
        resizeRatio = ($("#raphael-score").height())/( paperHeight );
      }
    }
  }

  this.scoreScrollAnimation = function(e) {
    $scrolltop = $("body").scrollTop();

    barPostion = Math.round(($scrolltop + 15)/resizeRatio);

    // Animate dots in proximity of bar location
    var dotArray = dotsByYRounded[Math.round(barPostion/precision)];

    if(dotArray) {

      for (var i = dotArray.length - 1; i >= 0; i--) {

        var anim = Raphael.animation({r: 40}, 400, "backOut");
        var animBack = Raphael.animation({r: dotArray[i].r}, 400, "bounce");

        paper.getById(dotArray[i].id).animate(anim).animate(animBack.delay(300));

        audioId = dotArray[i].xid;
        if(dotArray[i].xid > 22) audioId = dotArray[i].xid - 22;
        if(dotArray[i].xid > 44) audioId = dotArray[i].xid - 44;
        // console.log(dotArray[i].xid, audioId);
        if(audio[audioId]) {
          audio[audioId].play();
        } else {
          console.log(audioId);
        }
      };
    }

    // Update timestamp
    var totalSec = Math.round(($scrolltop / 39)/resizeRatio);
    var hours = Number(parseInt( totalSec / 3600 ) % 24).pad(2);
    var minutes = Number(parseInt( totalSec / 60 ) % 60).pad(2);
    var seconds = Number(parseInt(totalSec % 60, 10)).pad(2);
    var positiontimestamp = hours + ":" + minutes + ":" + seconds;
    // 0 > 26000 (600s)
    $('#raphael-score').attr('data-timestamp', positiontimestamp );
  };
}

document.body.onkeyup = function(e){
  if(e.keyCode == 86){ // letter "v"
    e.preventDefault();
    autoscroll.start();
  }
  if(e.keyCode == 80){ // letter "p"
    e.preventDefault();
    autoscroll.stop();
  }
}

autoscroll = {
  start: function() {
    var $body = $('html,body'),
        height = $('#raphael-score').height();
    $body.animate(
      {'scrollTop': '+=' + height}, 
      14 * 60000, 
      'linear', 
      function() {
        $body.scrollTop(0);
        autoscroll.start();
      }
    );
  },
  stop: function() {
    $('html,body').stop();
  }
}

var audio = document.getElementsByTagName("audio");

function enableAudio(element, audio, onEnd){
  var callback = false,
      click    = false;

  click = function(e){
    var forceStop = function () {
          audio.removeEventListener('play', forceStop, false);
          audio.pause();
          element.removeEventListener('touchend', click, false);
          if(onEnd) onEnd();
        },
        progress  = function () {
          audio.removeEventListener('canplaythrough', progress, false);
          if (callback) callback();
        };

    audio.addEventListener('play', forceStop, false);
    audio.addEventListener('canplaythrough', progress, false);
    try { 
      audio.play();
    } catch (e) {
      callback = function () {
        callback = false;
        audio.play();
      };
    }
  };
  element.addEventListener('touchend', click, false);
}

for (var i = audio.length - 1; i >= 0; i--) {
  enableAudio(window.document, audio[i]);
};


