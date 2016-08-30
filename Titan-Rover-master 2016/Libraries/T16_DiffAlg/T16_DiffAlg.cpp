#include "T16_DiffAlg.h"
#include "Arduino.h"
#include <math.h>

const uint16_t MAX_FWD = 1900;
const uint16_t MAX_REV = 1100;

T16_DiffAlg::T16_DiffAlg() {
	inputPWM_X = 0;
	inputPWM_Y = 0;
	inputPWM_MTH = 0;
}

T16_DiffAlg::~T16_DiffAlg() {}

uint16_t T16_DiffAlg::getPowLeft() {
	return power[0];
}

uint16_t T16_DiffAlg::getPowRight() {
	return power[1];
}

float T16_DiffAlg::getMaxThrottle() {
	return maxThrottle;
}

void T16_DiffAlg::calcSpeed(uint16_t x, uint16_t y) {

	//Filter input to ESC safe values.
	inputPWM_X = constrain(x, 1000, 2000);
	inputPWM_Y = constrain(y, 1000, 2000);

	//Map variables to cartesian coordinate format.
	_xCoord = map(inputPWM_X, 1000, 2000, -100, 100);
	_yCoord = map(inputPWM_Y, 1000, 2000, -100, 100);

	//Deadzone adjustment
	if (fabs(_xCoord) < 10) _xCoord = 0;
	if (fabs(_yCoord) < 10) _yCoord = 0;

	//If both coords within deadzone, return with 0 throttle.
	if (_xCoord == 0 && _yCoord == 0) {
		power[0] = 1500;
		power[1] = 1500;
		return;
	}
	else {
		_xCoord *= -1;

		calcVars();
		calcProps();
		calcPower();
	}
}

void T16_DiffAlg::calcVars() {
	v = (100 - fabs(_xCoord)) * (_yCoord / 100) + _yCoord;
	w = (100 - fabs(_yCoord)) * (_xCoord / 100) + _xCoord;
}

void T16_DiffAlg::calcProps() {
	propL = (v - w) / 2;
	propR = (v + w) / 2;
}

void T16_DiffAlg::calcPower() {
	if (propL < 0) {
		power[0] = 1500 - ((1500 - MAX_REV) * maxThrottle * (fabs(propL) / 100));
	}
	else {
		power[0] = 1500 + ((MAX_FWD - 1500) * maxThrottle * (propL / 100));
	}

	if (propR < 0) {
		power[1] = 1500 - ((1500 - MAX_REV) * maxThrottle * (fabs(propR) / 100));
	}
	else {
		power[1] = 1500 + ((MAX_FWD - 1500) * maxThrottle * (propR / 100));
	}
}

void T16_DiffAlg::setMaxThrottle(uint16_t z) {
	if (fabs(inputPWM_MTH - z) <= 20 ) return;
	else {
		inputPWM_MTH = constrain(z, 1000, 2000);
		maxThrottle = 0.01 * map(inputPWM_MTH, 1000, 2000, 40, 90);
	}
}
