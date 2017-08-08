var math = require('mathjs');

var l1 = 28; // Length of limb 1 inches
var l2 = 14; // Length of limb 2 inches

j1_bound = math.pi/4;
j2_bound = -1* math.pi/4;
var X ; 
var Y ; 
var THETA1D;
var THETA2D;

var minRangeDeg;
var maxRangeDeg;  

var minFeedback; // 255
var maxfeedback; // 0
// Given the XY, output the Thetas
function inverse_kinematics(X,Y,l1,l2){
  c2 = (Math.pow(X,2) + Math.pow(Y,2) - Math.pow(l1,2) - Math.pow(l2,2))/(2*l1*l2);
  s2 =  Math.sqrt(1 - Math.pow(c2,2));
  THETA2D = -math.atan2(s2, c2); // theta2 is deduced

  k1 = l1 + l2*math.cos(THETA2D);
  k2 = l2*(math.sin(THETA2D));
  gamma = math.atan2(k2, k1);
  THETA1D =  math.atan2(Y, X) - gamma    ; // Theta 1 deduced

}

// Given the Thetas, output the XY
function current_XY(THETA1D,THETA2D){
  var THETA1D = mapToDegrees(ln1); 
  var THETA2D = mapToDegrees(ln2); 
  X = l1*math.cos(THETA1D) + l2*math.cos(THETA1D+THETA2D);
  Y = l1*math.sin(THETA1D) + l2*math.sin(THETA1D+THETA2D);
}

//output = output_start + ((output_end - output_start) / (input_end - input_start)) * (input - input_start)


function mapToDegrees(feedbackVal){
  return minRangeDeg + (maxRangeDeg - minRangeDeg) / (maxRangeDeg - minRangeDeg) * (feedbackVal - minRangeDeg);

}
