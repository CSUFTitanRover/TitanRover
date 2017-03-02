var math = require('mathjs');

var l1 = 28; // Length of limb 1 inches
var l2 = 14; // Length of limb 2 inches

j1_bound = math.pi/4;
j2_bound = -1* math.pi/4;
var X ; 
var Y ; 
var THETA1D;
var THETA2D;

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
function forward_kinematics(THETA1D,THETA2D,l1,l2){
  X = l1*math.cos(THETA1D) + l2*math.cos(THETA1D+THETA2D);
  Y = l1*math.sin(THETA1D) + l2*math.sin(THETA1D+THETA2D);
}

// Testing all values within bounds
for(i = 0; i <=j1_bound; i+=0.01){
  for(j = 0; j >=j2_bound; j-=0.01){
    console.log("Given theta1  : " + THETA1D+ " Given theta2: " + THETA2D);
    forward_kinematics(i,j,l1,l2);
    inverse_kinematics(X,Y,l1,l2);
    console.log("Deduced Theta1: " + THETA1D+  " Deduced Theta2: "+ THETA2D);
    console.log("\n");
  }
}
