Number.prototype.pad=function(t){return(new Array(t+1).join("0")+this).slice(-t)},CanvasDrawer=function(t,e){var n=this;this.id=t,this.dataSource=e,this.init=function(){n.getNewContent(n.dataSource),setInterval(function(){n.getNewContent(n.dataSource)},3e3)},this.createRequestObject=function(){var t,e=navigator.appName;return t="Microsoft Internet Explorer"==e?new ActiveXObject("Microsoft.XMLHTTP"):new XMLHttpRequest},this.http=n.createRequestObject(),this.getNewContent=function(t){return n.http.open("post",n.dataSource),n.http.onreadystatechange=n.updateNewContent,n.http.send(null),!1},this.clearCanvas=function(){var t=document.getElementById(n.id),e=t.getContext("2d");e.clearRect(0,0,t.width,t.height)},this.updateNewContent=function(){if(4==n.http.readyState){var t=document.getElementById(n.id),e=t.getContext("2d"),a=n.http.responseText,r=a.split(/\r\n|\n/);e.strokeStyle="333333",e.fillStyle="333333",n.clearCanvas(n.id);for(var o=1;51>o;o++)var i=o*(t.width-10)/51+5;for(var o=0;o<r.length-1;o++){var s=(r.length-o-1)*t.height/r.length,c=new Date(Date.now()-5e3*r.length+5e3*o);e.fillText(c.getHours().pad(2)+":"+c.getMinutes().pad(2)+":"+c.getSeconds().pad(2),0,s+3),e.moveTo(50,s),e.lineTo(t.width-10,s),e.stroke();for(var d=r[o].split(","),h=1;51>h;h++)if(d[h]>0){var i=h*(t.width-60)/51+50,l=d[h];if(o==r.length-2){var p=new Audio("/templates/audio/Impact"+Math.floor(d[h])+".wav");p.play()}e.beginPath(),e.arc(i,s,1+l/4,0,2*Math.PI,!1),e.closePath(),e.fill()}}}}},WorkshopCanvas=function(t,e,n){var a=this;this.id=t,this.dataSource=e,this.color=n,this.init=function(){a.getNewContent(a.dataSource)},this.createRequestObject=function(){var t,e=navigator.appName;return t="Microsoft Internet Explorer"==e?new ActiveXObject("Microsoft.XMLHTTP"):new XMLHttpRequest},this.http=a.createRequestObject(),this.getNewContent=function(t){return a.http.open("post",a.dataSource),a.http.onreadystatechange=a.updateNewContent,a.http.send(null),!1},this.clearCanvas=function(){var t=document.getElementById(a.id),e=t.getContext("2d");e.clearRect(0,0,t.width,t.height)},this.updateNewContent=function(){if(4==a.http.readyState){var t=document.getElementById(a.id),e=t.getContext("2d"),n=a.http.responseText,r=n.split(/\r\n|\n/);e.strokeStyle=a.color,e.fillStyle=a.color,a.clearCanvas(a.id);var o=new pdf;o.setProperties({title:a.id,author:"Afonso Duarte",creator:"pdf.js"});for(var i=0,s=0;s<r.length-1;s++){var c=r[s].split(",");0!==s&&(i+=c[0]/630);var d=c[2]/1+15;e.moveTo(i,80+d),e.lineTo(i,80-d),e.stroke();var h=i/2;o.drawLine(h,40+d,h,40-d,1,"solid")}var l=a.id+"-"+(new Date).getSeconds()+".pdf",p=o.output("datauri",{fileName:l});$("#"+a.id).parent().find("h1").append(' (<a href = "'+p+'">PDF</a>)')}}};
//# sourceMappingURL=plugins.js.map
