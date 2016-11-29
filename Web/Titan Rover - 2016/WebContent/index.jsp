<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<script type="text/javascript" src="js/jquery-2.2.4.min.js"></script>
<script type="text/javascript" src="js/jquery-ui.min.js"></script>
<link rel="stylesheet" type="text/css" href="css/jquery-ui.css">
<style>
.table{
  width: 100%;
  background: #eeeeee;
  line-height: 32px;
  border: 1px solid black;
}
.bars { 
  float: left;
  height: 30px;
  line-height: 30px;
  border: 1px solid black;
  padding-left: 10px;
  padding-right: 10px;
  background: #FFFF33;
  color: #000000;
  }
.row{
  width: 100%;
  clear: both;
}
#toolbar {
  padding: 4px;
  display: inline-block;
}
/* support: IE7 */
*+html #toolbar {
  display: inline;
}
</style>
<title>Titan Rover UI - 2016</title>
<script>
function switchRelay(e){
	$.get("http://192.168.0.177/?"+e);
}

$(function() {
    $( "#esc_fl" ).button({
      text: false,
      icons: {
        primary: "ui-icon-gear"
      }
    }).click(function () {switchRelay(8);});
    $( "#esc_fr" ).button({
      text: false,
      icons: {
        primary: "ui-icon-gear"
      }
    }).click(function () {switchRelay(3);});
    $( "#esc_bl" ).button({
      text: false,
      icons: {
        primary: "ui-icon-gear"
      }
    }).click(function () {switchRelay(4);});
    $( "#esc_br" ).button({
        text: false,
        icons: {
          primary: "ui-icon-gear"
        }
      }).click(function () {switchRelay(5);});
    $( "#all" ).button({
        text: false,
        icons: {
          primary: "ui-icon-gear"
        }
      }).click(function () {switchRelay(6);});
//     		function() {
//       var options;
//       if ( $( this ).text() === "play" ) {
//         options = {
//           label: "pause",
//           icons: {
//             primary: "ui-icon-pause"
//           }
//         };
//       } else {
//         options = {
//           label: "play",
//           icons: {
//             primary: "ui-icon-play"
//           }
//         };
//       }
//       $( this ).button( "option", options );
//     });
  });
  
</script>
</head>
<body>
<div id="toolbar" class="ui-widget-header ui-corner-all">
  <button id="esc_fl">Front Left ESC</button>
  <button id="esc_fr">Front Right ESC</button>
  <button id="esc_bl">Back Left ESC</button>
  <button id="esc_br">Back Right ESC</button>
  <button id="all">All ESC's</button>
</div>

<br>
<button type="button" id="startData" style="height: 50px; width: 228px">Click here to start getting data</button>&nbsp;&nbsp;
<button type="button" id="stopData" style="height: 50px; width: 172px">Click here to stop </button><br>&nbsp;
<br>
<div class="table">
  <div class="row"><div class="bars">CM </div><div class="bars" id="Analog0"></div><div class="bars" id="A0">0</div></div><br>
</div>
<br> &nbsp;
<div id="FailureStatus"><H2>Status:</H2></div>
<br> &nbsp;
<div id="statusDiv"></div>
<script>
<!--This is the jQuery script which will connect to the Arduino -->
  var timeOut; //This variable is responsible for the frequency of data acquisition 
   
  //When the start button is clicked - get the data from the Arduino
  $("#startData").click(function(){
    $(document).ready(function(){
         getMyData(); //get data once the document is ready
    });
  });  
  
  
  //Stop collecting data when the stop button is clicked.
  $("#stopData").click(function(){
      clearTimeout(timeOut);        //This clears any future requests for data (until the Start button is pressed again)
  });
  
  function getMyData(){ 
    //Construct the URL of the Arduino Server we plan to connect to
    var myUrl = 'http://192.168.0.177:80/';
    
    var myData = $.ajax({
          url: myUrl,              // eg.  http://10.1.1.99:8081/
          data: { tag: 'GetDataFromArduino'},
          dataType : "json",      //We will be requesting data in JSON format
          timeout : 10000,        //this will cancel the request if it has not received a reply within 10 seconds.
          success: function(data){
              console.log('Success - you are a legend');
              $("#FailureStatus").html("<H2>Status: OK</H2>");  //clear any failure messages.
              $.each(data, function(index, element) { 
                 if(element.value<100){
                    console.log('Low'); 
                    $('#Analog' + element.key).css({'background-color':'#FF1128'}); 
                } else {
                    $('#Analog' + element.key).css({'background-color':'#22FF22'});
                }
              
                $('#A'+element.key).html("<span>" + element.value + "</span>");
                $('#Analog' + element.key).animate({width: element.value+"%"});
              });
        }});
        
    myData.error(function(xhr, status, errorThrown){
         
      $("#FailureStatus").html("<span><H2>Status:FAILED to get DATA !! </H2></SPAN>"); 
       
      console.log('Failure'); 
      console.log("Error: " + errorThrown); 
      console.log("Status: " + status);
      console.dir(xhr);
    });
    
    timeOut = setTimeout('getMyData()', 1000); //this will request data again in 1 second.
  }
</script>
</body>
</html>