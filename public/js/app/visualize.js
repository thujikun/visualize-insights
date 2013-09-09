google.load("visualization","1",{packages:["corechart"]}),function(){var a=Object.create(Object.prototype,{obj2Arr:{writable:!0,enumerable:!1,configurable:!1,value:function(a){return Array.prototype.slice.call(a)}},obj2Query:{writable:!0,enumerable:!1,configurable:!1,value:function(a){var b=Object.keys(a),c=[];return b.forEach(function(b){c.push(encodeURIComponent(b)+"="+encodeURIComponent(a[b]))}),c.join("&")}},googlize:{writable:!0,enumerable:!1,configurable:!1,value:function(a){var b=a.innerText.split(""),c=["rgb(103, 122, 246)","rgb(194, 39, 45)","rgb(237, 190, 0)","rgb(98, 170, 0)"],d=0,e=[];b.forEach(function(a){a.match(/\s/)?e.push(a):e.push('<span style="color: '+c[d++%c.length]+';">'+a+"</span>")}),a.innerHTML=e.join("")}},process:{writable:!0,enumerable:!1,configurable:!1,value:{processing:!1,is:function(){return this.processing},on:function(){this.processing=!0},off:function(){this.processing=!1}}}}),b=function(){this.init.apply(this,arguments)};Object.defineProperties(b.prototype,{init:{writable:!0,enumerable:!1,configurable:!1,value:function(a){this.socket=io.connect(a)}},on:{writable:!0,enumerable:!1,configurable:!1,value:function(a,b){this.socket.on(a,b)}},send:{writable:!0,enumerable:!1,configurable:!1,value:function(a,b){this.socket.emit(a,b)}}});var c=Object.create(Object.prototype,{CONST:{writable:!1,enumerable:!1,configurable:!1,value:{INSIGHTS_API_URL:"https://www.googleapis.com/pagespeedonline/v1/runPagespeed?",SCORE_CLASS:"score "}},socket:{writable:!1,enumerable:!1,configurable:!1,value:new b("/")},channels:{writable:!1,enumerable:!1,configurable:!1,value:{get:"getInsightsResult",set:"setInsightsResult"}},analyzePerformance:{writable:!0,enumerable:!1,configurable:!1,value:function(b){var d=b.currentTarget.querySelector('input[type="url"]').value,e=a.obj2Query({url:d,strategy:"mobile",locale:"ja"}),f=document.getElementsByClassName("result")[0],g=a.obj2Arr(f.childNodes),h=new XMLHttpRequest;b.preventDefault(),a.process.is()||(a.process.on(),g.forEach(function(a){a.style.display="none"}),h.open("GET",this.CONST.INSIGHTS_API_URL+e,!0),h.responseType="JSON",h.onload=function(){a.process.off(),200===this.status?c.visualizeInsightsResult(JSON.parse(this.responseText)):alert("error")},h.send())}},visualizeInsightsResult:{writable:!0,enumerable:!1,configurable:!1,value:function(b){console.log(b);var c,d=b.formattedResults.ruleResults,e=a.obj2Arr(document.getElementsByTagName("section")),f=document.getElementsByClassName("score")[0];this.socket.send(this.channels.set,b),e.forEach(function(a){a.style.display="block"}),f.innerText=b.score,f.className=this.CONST.SCORE_CLASS+this.gradeScore(b.score),c=this.getImpactChartData(d),this.renderChart("pie",c,document.getElementById("performance-impact-chart"))}},gradeScore:{writable:!0,enumerable:!1,configurable:!1,value:function(a){var b="";return b=100===a?"perfect":a>80?"high":a>60?"middle":"low"}},getImpactChartData:{writable:!0,enumerable:!1,configurable:!1,value:function(a){var b=Object.keys(a),c=[];return b.forEach(function(b){c.push([a[b].localizedRuleName,a[b].ruleImpact])}),google.visualization.arrayToDataTable(c)}},renderChart:{writable:!0,enumerable:!1,configurable:!1,value:function(a,b,c){var d,e={backgroundColor:"#000000",legend:{textStyle:{color:"#ffffff"}}};switch(a){case"pie":d=new google.visualization.PieChart(c)}d.draw(b,e)}}});document.addEventListener("DOMContentLoaded",function(){a.googlize(document.getElementsByTagName("h1")[0]),document.getElementsByClassName("search-form")[0].addEventListener("submit",c.analyzePerformance.bind(c),!1)},!1)}();