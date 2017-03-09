
var assert = require('assert');
var l1 = 28; // Length of limb 1 inches
var l2 = 14; // Length of limb 2 inches

J1_BOUND = Math.PI/4;
J2_BOUND = -1* Math.PI/4;

test_cases = [];

// Generate test cases
for(i = 0.01; i <= J1_BOUND; i += 0.01){
  for(j = -0.01; j >= J2_BOUND; j -= 0.01){
   test_cases.push([i,j]);
  }
}

// Given the XY, output the Thetas
function inverse_kinematics(X,Y,l1,l2){
  let c2 = (Math.pow(X,2) + Math.pow(Y,2) - Math.pow(l1,2) - Math.pow(l2,2))/(2*l1*l2);
  let s2 =  Math.sqrt(1 - Math.pow(c2,2));
  let THETA2D = -Math.atan2(s2, c2); // theta2 is deduced
  let k1 = l1 + l2*Math.cos(THETA2D);
  let k2 = l2*(Math.sin(THETA2D));
  let gamma = Math.atan2(k2, k1);
  let THETA1D =  Math.atan2(Y, X) - gamma    ; // Theta 1 deduced

  return [THETA1D,THETA2D];
}

// Given the Thetas, output the XY
function forward_kinematics(THETA1D,THETA2D,l1,l2){
  let X = l1*Math.cos(THETA1D) + l2*Math.cos(THETA1D+THETA2D);
  let Y = l1*Math.sin(THETA1D) + l2*Math.sin(THETA1D+THETA2D);
  
  return [X,Y];
}

test_cases.forEach(function(test){
	var X, Y;
	var THETA1;
	var THETA2;  
	describe('IK test for given Theta1: ' + test[0].toFixed(2) + ' Theta2: ' + test[1].toFixed(2),function(){    
		it('should return XY coordinates using forward kinematics',function(done){
			Coords = forward_kinematics(test[0],test[1],l1,l2);
			X = Coords[0];
			Y = Coords[1];
			done();
		});
		it('should return the thetas using inverse kinematics',function(done){
			angles = inverse_kinematics(X,Y,l1,l2);
			THETA1 = angles[0];
			THETA2 = angles[1];
			done();
		});
		it('is equal to the given theta values',function(done){
			//Uncomment to see full float value
			//console.log('\tDeduced Theta1: ' + THETA1 + ' Theta2: ' + THETA2);
			assert.deepEqual(THETA1.toFixed(2),test[0].toFixed(2), "THETA1D SHOULD BE EQUAL");
			assert.deepEqual(THETA2.toFixed(2),test[1].toFixed(2),"THETA2D SHOULD BE EQUAL");
			done();
		});
	});
	
});   

