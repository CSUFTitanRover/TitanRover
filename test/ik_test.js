var math = require('mathjs');
var assert = require('assert');
var l1 = 28; // Length of limb 1 inches
var l2 = 14; // Length of limb 2 inches

J1_BOUND = math.pi/4;
J2_BOUND = -1* math.pi/4;
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

// Chai Test
for(i = 0; i <=J1_BOUND; i+=0.01){
  for(j = 0; j >=J2_BOUND; j-=0.01){
    describe("IK test for given Theta1D: " + i.toFixed(4) + " Theta2D: "+ j.toFixed(4),function(){
      it('should equal the deduced theta',function(done){
        forward_kinematics(i,j,l1,l2);
        inverse_kinematics(X,Y,l1,l2);
        assert.deepEqual(THETA1D.toFixed(4),i.toFixed(4), "THETA1D SHOULD BE EQUAL");
        assert.deepEqual(THETA2D.toFixed(4),j.toFixed(4),"THETA2D SHOULD BE EQUAL");
        done();
      });
    });
  }
}


