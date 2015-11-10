CanvasDrawer = function(id, dataSource) {

    var that = this;
    this.id = id;
    this.dataSource = dataSource;

    this.init = function() {
        that.getNewContent( that.dataSource );
        setInterval(function(){ that.getNewContent( that.dataSource ); },3000);
    };

    this.createRequestObject = function() {
        var objAjax;
        var browser = navigator.appName;
        if(browser == "Microsoft Internet Explorer"){
            objAjax = new ActiveXObject("Microsoft.XMLHTTP");
        }
        else {
            objAjax = new XMLHttpRequest();
        }
        return objAjax;
    };

    // Canvas.js
    this.http = that.createRequestObject();

    this.getNewContent = function( dataSource ){
        that.http.open('post', that.dataSource );
        that.http.onreadystatechange = that.updateNewContent;
        that.http.send(null);
        return false;
    };

    this.clearCanvas = function(){
        var canvas = document.getElementById(that.id);
        var context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
    };

    this.updateNewContent = function() {
        if(that.http.readyState == 4){

            var canvas=document.getElementById(that.id);
            var ctx=canvas.getContext("2d");
            var allText = that.http.responseText;
            var allTextLines = allText.split(/\r\n|\n/);
            
            ctx.strokeStyle = "333333";
            ctx.fillStyle="333333";
            
            that.clearCanvas(that.id);

            for (var i=1; i<51; i++) {
                var x = i * (canvas.width - 10) /51 + 5;
                //ctx.fillText( i, x, 10);
            }

            for (var i=0; i<allTextLines.length-1; i++) {

                var y = (allTextLines.length-i-1) * canvas.height /allTextLines.length;

                var date = new Date(Date.now() - (allTextLines.length * 5000) + (i * 5000));

                ctx.fillText( date.getHours().pad(2)+':'+date.getMinutes().pad(2)+':'+date.getSeconds().pad(2)  , 0, y + 3);

                // draw horizontal lines
                ctx.moveTo(50,y);
                ctx.lineTo( canvas.width - 10 ,y);
                ctx.stroke();
                    
                var data = allTextLines[i].split(',');
                for (var j=1; j<51; j++) {
                    if (data[j] > 0) {
                        //draw dots
                        var x = j* (canvas.width - 60) /51 + 50;
                        var radius = data[j];

                        //Play Audio on first line
                        if(i == allTextLines.length-2 ) {
                            var snd = new Audio("/templates/audio/Impact"+Math.floor(data[j])+".wav"); // buffers automatically when created
                            snd.play();
                        }

                        ctx.beginPath();
                        ctx.arc(x, y, 1 + radius/4, 0 , 2 * Math.PI,false);
                        ctx.closePath();
                        ctx.fill();
                    }
                }
            }
        }
    };
};

WorkshopCanvas = function(id, dataSource, color) {

    var that = this;
    this.id = id;
    this.dataSource = dataSource;
    this.color = color;

    this.init = function() {
        that.getNewContent( that.dataSource );
    };

    this.createRequestObject = function() {
        var objAjax;
        var browser = navigator.appName;
        if(browser == "Microsoft Internet Explorer"){
            objAjax = new ActiveXObject("Microsoft.XMLHTTP");
        }
        else {
            objAjax = new XMLHttpRequest();
        }
        return objAjax;
    };

    // Canvas.js
    this.http = that.createRequestObject();

    this.getNewContent = function( dataSource ){
        that.http.open('post', that.dataSource );
        that.http.onreadystatechange = that.updateNewContent;
        that.http.send(null);
        return false;
    };

    this.clearCanvas = function(){
        var canvas = document.getElementById(that.id);
        var context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
    };

    this.updateNewContent = function() {

        if(that.http.readyState == 4){

            // Generate Canvas
            var canvas=document.getElementById(that.id);
            var ctx=canvas.getContext("2d");
            var allText = that.http.responseText;
            var allTextLines = allText.split(/\r\n|\n/);
            
            ctx.strokeStyle = that.color;
            ctx.fillStyle= that.color;
            
            that.clearCanvas(that.id);

            // GENERATE PDF
            var doc = new pdf();

            /* set properties on the document */
            doc.setProperties({
            title: that.id,
            author: 'Afonso Duarte',
            creator: 'pdf.js'
            });

            // DRAW

            var x = 0;

            for (var i=0; i<allTextLines.length-1; i++) {
                    
                var data = allTextLines[i].split(',');

                if(i !== 0) {
                    x += data[0]/630;
                }
                var y = (data[2]/1) + 15;

                // CANVAS
                ctx.moveTo(x, 80 + y);
                ctx.lineTo(x, 80 - y);
                ctx.stroke();

                var pdfx = x/2;
                // PDF
                doc.drawLine(pdfx, 40 + y, pdfx, 40 - y, 1.0, 'solid');
            }


            var fileName = that.id+"-"+new Date().getSeconds()+".pdf";
            var pdfAsDataURI = doc.output('datauri', {"fileName":fileName});

            // create a link
            // this seems to always work, except clicking the link destroys my FF instantly 
            $('#'+that.id).parent().find('h1').append(' (<a href = "'+pdfAsDataURI+'">PDF</a>)');


        }

    };
};