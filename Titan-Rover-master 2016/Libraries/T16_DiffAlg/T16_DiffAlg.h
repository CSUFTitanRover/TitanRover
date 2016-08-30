#pragma once

#ifndef T16_DiffAlg_h
#define T16_DiffAlg_h

#include "Arduino.h"
#include "stdint.h"

class T16_DiffAlg
{
public:
	T16_DiffAlg();
	~T16_DiffAlg();

	void calcSpeed(uint16_t x, uint16_t y);

	uint16_t getPowLeft();
	uint16_t getPowRight();

	void setMaxThrottle(uint16_t z);
	
	float getMaxThrottle();

private:
	uint16_t inputPWM_X;
	uint16_t inputPWM_Y;
	uint16_t inputPWM_MTH;
	
	float _xCoord;
	float _yCoord;

	float v;
	float w;

	float propL;
	float propR;

	float maxThrottle;

	uint16_t power[2];

	void calcVars();
	void calcProps();
	void calcPower();
};

#endif
