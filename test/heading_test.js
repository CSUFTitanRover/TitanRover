
// Generate test cases

test_cases = [];
for(i = 0; i <= 360; ++i ){
  for(j = 0; j <= 360; ++j){
   test_cases.push([i,j]);
  }
}

function turn_heading(test){
    var current_heading = test[0];
    var target_heading = test[1];

    var heading_delta =current_heading - target_heading;
    var delta_is_positive = heading_delta > 0;
    if(delta_is_positive){
        if(Math.abs(heading_delta) > 180){
            return 'current : ' + test[0] + ' target : ' + target_heading+ ' turn right';
        }else{
            return 'current : ' + test[0] + ' target : ' + target_heading+ ' turn left';
        }
    }else{
        if(Math.abs(heading_delta) > 180){
            return 'current : ' + test[0] + ' target : ' + target_heading+ ' turn left';
        }else{
            return 'current : ' + test[0] + ' target : ' + target_heading+ ' turn right';
            }
    }
}

test_cases.forEach(function(test){
    
    console.log(turn_heading(test));	
});


