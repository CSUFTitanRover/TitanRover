
var minRangeDeg = 0;
var maxRangeDeg = 90;  

var minFeedback = 0; // 255
var maxFeedback = 255 ; // 0

function mapToDegrees(feedbackVal){
  console.log( (minRangeDeg + (maxRangeDeg - minRangeDeg) / (minFeedback - maxFeedback) * (feedbackVal - minRangeDeg)));

}


for(i = 0; i <= 255; i++){
    mapToDegrees(i);
}