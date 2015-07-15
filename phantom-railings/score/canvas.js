var http = createRequestObject();

function createRequestObject() {
	var objAjax;
	var browser = navigator.appName;
	if(browser == "Microsoft Internet Explorer"){	
	objAjax = new ActiveXObject("Microsoft.XMLHTTP");
}
else{	
	objAjax = new XMLHttpRequest();}return objAjax;
}

function getNewContent(){
	http.open('post','data.txt');
	http.onreadystatechange = updateNewContent;
	http.send(null);
	return false;
}

function clearCanvas(){
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function updateNewContent(){	
	if(http.readyState == 4){

		var c=document.getElementById("myCanvas");
		var ctx=c.getContext("2d");	
		var allText = http.responseText;
		var allTextLines = allText.split(/\r\n|\n/);
		
		ctx.strokeStyle = "333333";
		ctx.fillStyle="333333";
		
		clearCanvas();
		
		for (var i=0; i<allTextLines.length-1; i++) {
 			var y = (allTextLines.length-i-1)*600/allTextLines.length;	
 			ctx.moveTo(10,y);
 			ctx.lineTo(590,y);
 			ctx.stroke();
 				
 			var data = allTextLines[i].split(',');
 			for (var j=1; j<51; j++) {	
 				if (data[j] > 0) {
 				var x = j*600/51;
 				var radius = data[j];
 				//ctx.fillRect(x-radius/4, y-radius/4, radius/2, radius/2);
 				ctx.beginPath();
 				ctx.arc(x, y, 1 + radius/4, 0 , 2 * Math.PI,false);
 				ctx.closePath();
 				ctx.fill();
 				}
 			}
 		}
 	}
}

function runAll(){
	getNewContent();
}

setInterval(function(){
   runAll()
},5000);

window.onload = runAll;