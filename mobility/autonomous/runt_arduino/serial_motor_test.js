var serialPort = require('serialport');

var port = new serialPort('/dev/ttyACM0', {
    baudRate: 9600,
    parser: serialPort.parsers.readline('\n')
});

var x_Axis_arr = new Uint16Array(2);
x_Axis_arr[0] = 0x0008;
var x_Axis_buff = Buffer.from(x_Axis_arr.buffer);

var y_Axis_arr = new Uint16Array(2);
y_Axis_arr[0] = 0x0009;
var y_Axis_buff = Buffer.from(y_Axis_arr.buffer);

function setYAxis(speed) {
    if (speed < -127 || speed > 127) {
        throw new RangeError('speed must be between -127 and 127');
    }
    // Since we are using unsigened ints for serial make it between 0 and 254
    y_Axis_arr[1] = speed + 127;
    port.write(y_Axis_buff);
}

function setXAxis(speed) {
    if (speed < -127 || speed > 127) {
        throw new RangeError('speed must be between -127 and 127');
    }

    // Since we are using unsigned ints for serial make it between 0 and 254
    x_Axis_arr[1] = speed + 127;
    port.write(x_Axis_buff);
}


setInterval(function(){

},20);