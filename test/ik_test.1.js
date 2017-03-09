var math = require('mathjs');
var assert = require('assert');
var l1 = 28; // Length of limb 1 inches
var l2 = 14; // Length of limb 2 inches

J1_BOUND = math.pi/4;
J2_BOUND = -1* math.pi/4;

var i; 
var j;
var X ; 
var Y ; 
var THETA1D;
var THETA2D;

test_cases = [];
// Chai Test
for(i = 0.01; i <= J1_BOUND; i += 0.01){
  for(j = -0.01; j >= J2_BOUND; j -= 0.01){
   test_cases.push([i,j]);
  }
}

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


test_cases.forEach(function(test){
   describe('IK test for Given Theta1: ' + test[0] + 'Theta2:' + test[1] ,function(){
          forward_kinematics(test[0],test[1],l1,l2);
          inverse_kinematics(X,Y,l1,l2);
          it('should equal the deduced theta1: ' + THETA1D + 'theta2d: ' + THETA2D  ,function(done){
            console.log('theta1: ' + THETA1D + 'theta2d: ' + THETA2D);
            assert.deepEqual(THETA1D.toFixed(2),test[0].toFixed(2), "THETA1D SHOULD BE EQUAL");
            assert.deepEqual(THETA2D.toFixed(2),test[1].toFixed(2),"THETA2D SHOULD BE EQUAL");
            done();
        });
      });
    });   




