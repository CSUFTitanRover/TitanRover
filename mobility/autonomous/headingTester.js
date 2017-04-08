 var sys = require('util');
 
for (var current_heading = 1; current_heading < 361; current_heading++) {
    for (var target_heading = 1; target_heading < 361; target_heading++) {
        var heading_delta = current_heading - target_heading;
        if(current_heading > target_heading){
                if(Math.abs(heading_delta) > 180){
                    heading_delta = 360 - current_heading + target_heading;
                    console.log("Current Heading: " + current_heading);
                    console.log("Target Heading: " + target_heading);
                    console.log("Heading Delta: " + heading_delta)
                    console.log('turning right');
                }else{
                    heading_delta = current_heading - target_heading;
                    console.log("Current Heading: " + current_heading);
                    console.log("Target Heading: " + target_heading);
                    console.log("Heading Delta: " + heading_delta)
                    console.log('turning left');
                    }
            }else{
                if(Math.abs(heading_delta) > 180){
                    heading_delta = 360 - target_heading + current_heading;
                    console.log("Current Heading: " + current_heading);
                    console.log("Target Heading: " + target_heading);
                    console.log("Heading Delta: " + heading_delta)
                    console.log('turning left');
                }else{
                    heading_delta = target_heading - current_heading;
                    console.log("Current Heading: " + current_heading);
                    console.log("Target Heading: " + target_heading);
                    console.log("Heading Delta: " + heading_delta)
                    console.log('turning right');
                }
            }
    }
}