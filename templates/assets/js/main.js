var $ = jQuery  = require('jquery');
var utils       = require('./_utils.js');
var canvasAnimation = require('./_canvas-animation.js');
var scoreScroll = require('./_score-scroll.js');

$(function() {  
  if($('#myCanvas').length > 0) {
    prCanvas = new CanvasDrawer('myCanvas','/score/data.php');
    prCanvas.init();
  }

  if($('#workshop-canvas-01').length > 0) {
    workshopCanvasA = new WorkshopCanvas('workshop-canvas-01', '/content/03.workshop/01.bridge-13.54.34.log.csv', "FF0000");
    workshopCanvasA.init();

    workshopCanvasB = new WorkshopCanvas('workshop-canvas-02', '/content/03.workshop/02.pavement-14.11.08.log.csv', "00FF00");
    workshopCanvasB.init();

    workshopCanvasC = new WorkshopCanvas('workshop-canvas-03', '/content/03.workshop/03.stairs-13.04.13.log.csv', "0000FF");
    workshopCanvasC.init();
  }

  if($('#raphael-score').length > 0) {
    score = new ScoreScroll();
    score.init();
  }
});