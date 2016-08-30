
/tmp/build5736274865649334927.tmp/SimpleExample328.cpp.elf:     file format elf32-avr


Disassembly of section .text:

00000000 <__vectors>:
       0:	0c 94 59 00 	jmp	0xb2	; 0xb2 <__ctors_end>
       4:	0c 94 81 00 	jmp	0x102	; 0x102 <__bad_interrupt>
       8:	0c 94 81 00 	jmp	0x102	; 0x102 <__bad_interrupt>
       c:	0c 94 91 01 	jmp	0x322	; 0x322 <__vector_3>
      10:	0c 94 be 01 	jmp	0x37c	; 0x37c <__vector_4>
      14:	0c 94 eb 01 	jmp	0x3d6	; 0x3d6 <__vector_5>
      18:	0c 94 81 00 	jmp	0x102	; 0x102 <__bad_interrupt>
      1c:	0c 94 81 00 	jmp	0x102	; 0x102 <__bad_interrupt>
      20:	0c 94 81 00 	jmp	0x102	; 0x102 <__bad_interrupt>
      24:	0c 94 81 00 	jmp	0x102	; 0x102 <__bad_interrupt>
      28:	0c 94 81 00 	jmp	0x102	; 0x102 <__bad_interrupt>
      2c:	0c 94 81 00 	jmp	0x102	; 0x102 <__bad_interrupt>
      30:	0c 94 81 00 	jmp	0x102	; 0x102 <__bad_interrupt>
      34:	0c 94 81 00 	jmp	0x102	; 0x102 <__bad_interrupt>
      38:	0c 94 81 00 	jmp	0x102	; 0x102 <__bad_interrupt>
      3c:	0c 94 81 00 	jmp	0x102	; 0x102 <__bad_interrupt>
      40:	0c 94 9f 02 	jmp	0x53e	; 0x53e <__vector_16>
      44:	0c 94 81 00 	jmp	0x102	; 0x102 <__bad_interrupt>
      48:	0c 94 3e 04 	jmp	0x87c	; 0x87c <__vector_18>
      4c:	0c 94 81 04 	jmp	0x902	; 0x902 <__vector_19>
      50:	0c 94 81 00 	jmp	0x102	; 0x102 <__bad_interrupt>
      54:	0c 94 81 00 	jmp	0x102	; 0x102 <__bad_interrupt>
      58:	0c 94 81 00 	jmp	0x102	; 0x102 <__bad_interrupt>
      5c:	0c 94 81 00 	jmp	0x102	; 0x102 <__bad_interrupt>
      60:	0c 94 81 00 	jmp	0x102	; 0x102 <__bad_interrupt>
      64:	0c 94 81 00 	jmp	0x102	; 0x102 <__bad_interrupt>

00000068 <digital_pin_to_bit_mask_PGM>:
      68:	01 02 04 08 10 20 40 80 01 02 04 08 10 20 01 02     ..... @...... ..
      78:	04 08 10 20                                         ... 

0000007c <digital_pin_to_port_PGM>:
      7c:	04 04 04 04 04 04 04 04 02 02 02 02 02 02 03 03     ................
      8c:	03 03 03 03                                         ....

00000090 <port_to_input_PGM>:
      90:	00 00 00 00 23 00 26 00 29 00                       ....#.&.).

0000009a <port_to_output_PGM>:
      9a:	00 00 00 00 25 00 28 00 2b 00                       ....%.(.+.

000000a4 <port_to_mode_PGM>:
      a4:	00 00 00 00 24 00 27 00 2a 00                       ....$.'.*.

000000ae <__ctors_start>:
      ae:	53 02       	muls	r21, r19
      b0:	3d 05       	cpc	r19, r13

000000b2 <__ctors_end>:
      b2:	11 24       	eor	r1, r1
      b4:	1f be       	out	0x3f, r1	; 63
      b6:	cf ef       	ldi	r28, 0xFF	; 255
      b8:	d8 e0       	ldi	r29, 0x08	; 8
      ba:	de bf       	out	0x3e, r29	; 62
      bc:	cd bf       	out	0x3d, r28	; 61

000000be <__do_copy_data>:
      be:	11 e0       	ldi	r17, 0x01	; 1
      c0:	a0 e0       	ldi	r26, 0x00	; 0
      c2:	b1 e0       	ldi	r27, 0x01	; 1
      c4:	ee e5       	ldi	r30, 0x5E	; 94
      c6:	f0 e1       	ldi	r31, 0x10	; 16
      c8:	02 c0       	rjmp	.+4      	; 0xce <__do_copy_data+0x10>
      ca:	05 90       	lpm	r0, Z+
      cc:	0d 92       	st	X+, r0
      ce:	aa 36       	cpi	r26, 0x6A	; 106
      d0:	b1 07       	cpc	r27, r17
      d2:	d9 f7       	brne	.-10     	; 0xca <__do_copy_data+0xc>

000000d4 <__do_clear_bss>:
      d4:	12 e0       	ldi	r17, 0x02	; 2
      d6:	aa e6       	ldi	r26, 0x6A	; 106
      d8:	b1 e0       	ldi	r27, 0x01	; 1
      da:	01 c0       	rjmp	.+2      	; 0xde <.do_clear_bss_start>

000000dc <.do_clear_bss_loop>:
      dc:	1d 92       	st	X+, r1

000000de <.do_clear_bss_start>:
      de:	a3 34       	cpi	r26, 0x43	; 67
      e0:	b1 07       	cpc	r27, r17
      e2:	e1 f7       	brne	.-8      	; 0xdc <.do_clear_bss_loop>

000000e4 <__do_global_ctors>:
      e4:	10 e0       	ldi	r17, 0x00	; 0
      e6:	c2 eb       	ldi	r28, 0xB2	; 178
      e8:	d0 e0       	ldi	r29, 0x00	; 0
      ea:	04 c0       	rjmp	.+8      	; 0xf4 <__do_global_ctors+0x10>
      ec:	22 97       	sbiw	r28, 0x02	; 2
      ee:	fe 01       	movw	r30, r28
      f0:	0e 94 29 08 	call	0x1052	; 0x1052 <__tablejump__>
      f4:	ce 3a       	cpi	r28, 0xAE	; 174
      f6:	d1 07       	cpc	r29, r17
      f8:	c9 f7       	brne	.-14     	; 0xec <__do_global_ctors+0x8>
      fa:	0e 94 cf 06 	call	0xd9e	; 0xd9e <main>
      fe:	0c 94 2d 08 	jmp	0x105a	; 0x105a <_exit>

00000102 <__bad_interrupt>:
     102:	0c 94 00 00 	jmp	0	; 0x0 <__vectors>

00000106 <_Z17interruptFunctionv>:
     106:	80 91 6a 01 	lds	r24, 0x016A
     10a:	8f 5f       	subi	r24, 0xFF	; 255
     10c:	80 93 6a 01 	sts	0x016A, r24
     110:	08 95       	ret

00000112 <_ZN9PCintPort6enableEPNS_8PCintPinEPFvvEh>:

    return port;
}


void PCintPort::enable(PCintPin* p, PCIntvoidFuncPtr userFunc, uint8_t mode) {
     112:	cf 93       	push	r28
     114:	df 93       	push	r29
     116:	dc 01       	movw	r26, r24
     118:	fb 01       	movw	r30, r22
	// Enable the pin for interrupts by adding to the PCMSKx register.
	// ...The final steps; at this point the interrupt is enabled on this pin.
	p->mode=mode;
     11a:	22 83       	std	Z+2, r18	; 0x02
	p->PCintFunc=userFunc;
     11c:	51 83       	std	Z+1, r21	; 0x01
     11e:	40 83       	st	Z, r20
	}
	else {
		portPCMask |= p->mask;
	}
#else
    portPCMask |= p->mask;
     120:	12 96       	adiw	r26, 0x02	; 2
     122:	cd 91       	ld	r28, X+
     124:	dc 91       	ld	r29, X
     126:	13 97       	sbiw	r26, 0x03	; 3
     128:	88 81       	ld	r24, Y
     12a:	93 81       	ldd	r25, Z+3	; 0x03
     12c:	89 2b       	or	r24, r25
     12e:	88 83       	st	Y, r24
#endif
	if ((p->mode == RISING) || (p->mode == CHANGE)) portRisingPins |= p->mask;
     130:	82 81       	ldd	r24, Z+2	; 0x02
     132:	8d 7f       	andi	r24, 0xFD	; 253
     134:	81 30       	cpi	r24, 0x01	; 1
     136:	41 f4       	brne	.+16     	; 0x148 <_ZN9PCintPort6enableEPNS_8PCintPinEPFvvEh+0x36>
     138:	15 96       	adiw	r26, 0x05	; 5
     13a:	8c 91       	ld	r24, X
     13c:	15 97       	sbiw	r26, 0x05	; 5
     13e:	93 81       	ldd	r25, Z+3	; 0x03
     140:	89 2b       	or	r24, r25
     142:	15 96       	adiw	r26, 0x05	; 5
     144:	8c 93       	st	X, r24
     146:	15 97       	sbiw	r26, 0x05	; 5
	if ((p->mode == FALLING) || (p->mode == CHANGE)) portFallingPins |= p->mask;
     148:	82 81       	ldd	r24, Z+2	; 0x02
     14a:	81 50       	subi	r24, 0x01	; 1
     14c:	82 30       	cpi	r24, 0x02	; 2
     14e:	40 f4       	brcc	.+16     	; 0x160 <_ZN9PCintPort6enableEPNS_8PCintPinEPFvvEh+0x4e>
     150:	16 96       	adiw	r26, 0x06	; 6
     152:	8c 91       	ld	r24, X
     154:	16 97       	sbiw	r26, 0x06	; 6
     156:	93 81       	ldd	r25, Z+3	; 0x03
     158:	89 2b       	or	r24, r25
     15a:	16 96       	adiw	r26, 0x06	; 6
     15c:	8c 93       	st	X, r24
     15e:	16 97       	sbiw	r26, 0x06	; 6
	PCICR |= PCICRbit;
     160:	80 91 68 00 	lds	r24, 0x0068
     164:	14 96       	adiw	r26, 0x04	; 4
     166:	9c 91       	ld	r25, X
     168:	89 2b       	or	r24, r25
     16a:	80 93 68 00 	sts	0x0068, r24
}
     16e:	df 91       	pop	r29
     170:	cf 91       	pop	r28
     172:	08 95       	ret

00000174 <_ZN9PCintPort6addPinEhPFvvEh>:

int8_t PCintPort::addPin(uint8_t arduinoPin, PCIntvoidFuncPtr userFunc, uint8_t mode)
{
     174:	ef 92       	push	r14
     176:	ff 92       	push	r15
     178:	0f 93       	push	r16
     17a:	1f 93       	push	r17
     17c:	cf 93       	push	r28
     17e:	df 93       	push	r29
     180:	00 d0       	rcall	.+0      	; 0x182 <_ZN9PCintPort6addPinEhPFvvEh+0xe>
     182:	00 d0       	rcall	.+0      	; 0x184 <_ZN9PCintPort6addPinEhPFvvEh+0x10>
     184:	cd b7       	in	r28, 0x3d	; 61
     186:	de b7       	in	r29, 0x3e	; 62
     188:	8c 01       	movw	r16, r24
	PCintPin* tmp;

	tmp=firstPin;
     18a:	fc 01       	movw	r30, r24
     18c:	e0 84       	ldd	r14, Z+8	; 0x08
     18e:	f1 84       	ldd	r15, Z+9	; 0x09
	// Add to linked list, starting with firstPin. If pin already exists, just enable.
	if (firstPin != NULL) {
     190:	e1 14       	cp	r14, r1
     192:	f1 04       	cpc	r15, r1
     194:	89 f0       	breq	.+34     	; 0x1b8 <_ZN9PCintPort6addPinEhPFvvEh+0x44>
		do {
			if (tmp->arduinoPin == arduinoPin) { enable(tmp, userFunc, mode); return(0); }
     196:	f7 01       	movw	r30, r14
     198:	84 81       	ldd	r24, Z+4	; 0x04
     19a:	86 13       	cpse	r24, r22
     19c:	06 c0       	rjmp	.+12     	; 0x1aa <_ZN9PCintPort6addPinEhPFvvEh+0x36>
     19e:	b7 01       	movw	r22, r14
     1a0:	c8 01       	movw	r24, r16
     1a2:	0e 94 89 00 	call	0x112	; 0x112 <_ZN9PCintPort6enableEPNS_8PCintPinEPFvvEh>
     1a6:	80 e0       	ldi	r24, 0x00	; 0
     1a8:	40 c0       	rjmp	.+128    	; 0x22a <_ZN9PCintPort6addPinEhPFvvEh+0xb6>
			if (tmp->next == NULL) break;
     1aa:	f7 01       	movw	r30, r14
     1ac:	85 81       	ldd	r24, Z+5	; 0x05
     1ae:	96 81       	ldd	r25, Z+6	; 0x06
     1b0:	00 97       	sbiw	r24, 0x00	; 0
     1b2:	11 f0       	breq	.+4      	; 0x1b8 <_ZN9PCintPort6addPinEhPFvvEh+0x44>
			tmp=tmp->next;
     1b4:	7c 01       	movw	r14, r24
     1b6:	ef cf       	rjmp	.-34     	; 0x196 <_ZN9PCintPort6addPinEhPFvvEh+0x22>
		} while (true);
	}

	// Create pin p:  fill in the data.
	PCintPin* p=new PCintPin;
     1b8:	87 e0       	ldi	r24, 0x07	; 7
     1ba:	90 e0       	ldi	r25, 0x00	; 0
     1bc:	2c 83       	std	Y+4, r18	; 0x04
     1be:	4a 83       	std	Y+2, r20	; 0x02
     1c0:	5b 83       	std	Y+3, r21	; 0x03
     1c2:	69 83       	std	Y+1, r22	; 0x01
     1c4:	0e 94 dc 06 	call	0xdb8	; 0xdb8 <_Znwj>
     1c8:	dc 01       	movw	r26, r24
protected:
	class PCintPin {
	public:
		PCintPin() :
		PCintFunc((PCIntvoidFuncPtr)NULL),
		mode(0) {}
     1ca:	11 96       	adiw	r26, 0x01	; 1
     1cc:	1c 92       	st	X, r1
     1ce:	1e 92       	st	-X, r1
     1d0:	12 96       	adiw	r26, 0x02	; 2
     1d2:	1c 92       	st	X, r1
     1d4:	12 97       	sbiw	r26, 0x02	; 2
		} while (true);
	}

	// Create pin p:  fill in the data.
	PCintPin* p=new PCintPin;
	if (p == NULL) return(-1);
     1d6:	2c 81       	ldd	r18, Y+4	; 0x04
     1d8:	4a 81       	ldd	r20, Y+2	; 0x02
     1da:	5b 81       	ldd	r21, Y+3	; 0x03
     1dc:	69 81       	ldd	r22, Y+1	; 0x01
     1de:	00 97       	sbiw	r24, 0x00	; 0
     1e0:	19 f1       	breq	.+70     	; 0x228 <_ZN9PCintPort6addPinEhPFvvEh+0xb4>
	p->arduinoPin=arduinoPin;
     1e2:	14 96       	adiw	r26, 0x04	; 4
     1e4:	6c 93       	st	X, r22
     1e6:	14 97       	sbiw	r26, 0x04	; 4
	p->mode = mode;
     1e8:	12 96       	adiw	r26, 0x02	; 2
     1ea:	2c 93       	st	X, r18
     1ec:	12 97       	sbiw	r26, 0x02	; 2
	p->next=NULL;
     1ee:	16 96       	adiw	r26, 0x06	; 6
     1f0:	1c 92       	st	X, r1
     1f2:	1e 92       	st	-X, r1
     1f4:	15 97       	sbiw	r26, 0x05	; 5
	p->mask = digitalPinToBitMask(arduinoPin); // the mask
     1f6:	e6 2f       	mov	r30, r22
     1f8:	f0 e0       	ldi	r31, 0x00	; 0
     1fa:	e8 59       	subi	r30, 0x98	; 152
     1fc:	ff 4f       	sbci	r31, 0xFF	; 255
     1fe:	e4 91       	lpm	r30, Z
     200:	13 96       	adiw	r26, 0x03	; 3
     202:	ec 93       	st	X, r30
     204:	13 97       	sbiw	r26, 0x03	; 3

	if (firstPin == NULL) firstPin=p;
     206:	f8 01       	movw	r30, r16
     208:	80 85       	ldd	r24, Z+8	; 0x08
     20a:	91 85       	ldd	r25, Z+9	; 0x09
     20c:	89 2b       	or	r24, r25
     20e:	19 f4       	brne	.+6      	; 0x216 <_ZN9PCintPort6addPinEhPFvvEh+0xa2>
     210:	b1 87       	std	Z+9, r27	; 0x09
     212:	a0 87       	std	Z+8, r26	; 0x08
     214:	03 c0       	rjmp	.+6      	; 0x21c <_ZN9PCintPort6addPinEhPFvvEh+0xa8>
	else tmp->next=p; // NOTE that tmp cannot be NULL.
     216:	f7 01       	movw	r30, r14
     218:	b6 83       	std	Z+6, r27	; 0x06
     21a:	a5 83       	std	Z+5, r26	; 0x05
	int addr = (int) p;
	Serial.print(" instance addr: "); Serial.println(addr, HEX);
	Serial.print("userFunc addr: "); Serial.println((int)p->PCintFunc, HEX);
#endif

	enable(p, userFunc, mode);
     21c:	bd 01       	movw	r22, r26
     21e:	c8 01       	movw	r24, r16
     220:	0e 94 89 00 	call	0x112	; 0x112 <_ZN9PCintPort6enableEPNS_8PCintPinEPFvvEh>
#ifdef DEBUG
	Serial.print("addPin. pin given: "); Serial.print(arduinoPin, DEC), Serial.print (" pin stored: ");
	int addr = (int) p;
	Serial.print(" instance addr: "); Serial.println(addr, HEX);
#endif
	return(1);
     224:	81 e0       	ldi	r24, 0x01	; 1
     226:	01 c0       	rjmp	.+2      	; 0x22a <_ZN9PCintPort6addPinEhPFvvEh+0xb6>
		} while (true);
	}

	// Create pin p:  fill in the data.
	PCintPin* p=new PCintPin;
	if (p == NULL) return(-1);
     228:	8f ef       	ldi	r24, 0xFF	; 255
	Serial.print("addPin. pin given: "); Serial.print(arduinoPin, DEC), Serial.print (" pin stored: ");
	int addr = (int) p;
	Serial.print(" instance addr: "); Serial.println(addr, HEX);
#endif
	return(1);
}
     22a:	0f 90       	pop	r0
     22c:	0f 90       	pop	r0
     22e:	0f 90       	pop	r0
     230:	0f 90       	pop	r0
     232:	df 91       	pop	r29
     234:	cf 91       	pop	r28
     236:	1f 91       	pop	r17
     238:	0f 91       	pop	r16
     23a:	ff 90       	pop	r15
     23c:	ef 90       	pop	r14
     23e:	08 95       	ret

00000240 <_ZN9PCintPort15attachInterruptEhPFvvEi>:

/*
 * attach an interrupt to a specific pin using pin change interrupts.
 */
int8_t PCintPort::attachInterrupt(uint8_t arduinoPin, PCIntvoidFuncPtr userFunc, int mode)
{
     240:	24 2f       	mov	r18, r20
	PCintPort *port;
	uint8_t portNum = digitalPinToPort(arduinoPin);
     242:	e8 2f       	mov	r30, r24
     244:	f0 e0       	ldi	r31, 0x00	; 0
     246:	e4 58       	subi	r30, 0x84	; 132
     248:	ff 4f       	sbci	r31, 0xFF	; 255
     24a:	e4 91       	lpm	r30, Z
	if ((portNum == NOT_A_PORT) || (userFunc == NULL)) return(-1);
     24c:	ee 23       	and	r30, r30
     24e:	d9 f0       	breq	.+54     	; 0x286 <_ZN9PCintPort15attachInterruptEhPFvvEi+0x46>
     250:	61 15       	cp	r22, r1
     252:	71 05       	cpc	r23, r1
     254:	c1 f0       	breq	.+48     	; 0x286 <_ZN9PCintPort15attachInterruptEhPFvvEi+0x46>
#endif // USE_PORT_JK

static PCintPort *lookupPortNumToPort( int portNum ) {
    PCintPort *port = NULL;

	switch (portNum) {
     256:	f0 e0       	ldi	r31, 0x00	; 0
     258:	32 97       	sbiw	r30, 0x02	; 2
     25a:	e3 30       	cpi	r30, 0x03	; 3
     25c:	f1 05       	cpc	r31, r1
     25e:	40 f4       	brcc	.+16     	; 0x270 <_ZN9PCintPort15attachInterruptEhPFvvEi+0x30>
     260:	ee 0f       	add	r30, r30
     262:	ff 1f       	adc	r31, r31
     264:	ed 5a       	subi	r30, 0xAD	; 173
     266:	fe 4f       	sbci	r31, 0xFE	; 254
     268:	01 90       	ld	r0, Z+
     26a:	f0 81       	ld	r31, Z
     26c:	e0 2d       	mov	r30, r0
     26e:	02 c0       	rjmp	.+4      	; 0x274 <_ZN9PCintPort15attachInterruptEhPFvvEi+0x34>
     270:	e0 e0       	ldi	r30, 0x00	; 0
     272:	f0 e0       	ldi	r31, 0x00	; 0
	if ((portNum == NOT_A_PORT) || (userFunc == NULL)) return(-1);

	port=lookupPortNumToPort(portNum);
	// Added by GreyGnome... must set the initial value of lastPinView for it to be correct on the 1st interrupt.
	// ...but even then, how do you define "correct"?  Ultimately, the user must specify (not provisioned for yet).
	port->lastPinView=port->portInputReg;
     274:	a0 81       	ld	r26, Z
     276:	b1 81       	ldd	r27, Z+1	; 0x01
     278:	9c 91       	ld	r25, X
     27a:	97 83       	std	Z+7, r25	; 0x07
#ifdef DEBUG
	Serial.print("attachInterrupt- pin: "); Serial.println(arduinoPin, DEC);
#endif
	// map pin to PCIR register
	return(port->addPin(arduinoPin,userFunc,mode));
     27c:	ab 01       	movw	r20, r22
     27e:	68 2f       	mov	r22, r24
     280:	cf 01       	movw	r24, r30
     282:	0c 94 ba 00 	jmp	0x174	; 0x174 <_ZN9PCintPort6addPinEhPFvvEh>
}
     286:	8f ef       	ldi	r24, 0xFF	; 255
     288:	08 95       	ret

0000028a <_ZN9PCintPort5PCintEv>:
	}
}

// common code for isr handler. "port" is the PCINT number.
// there isn't really a good way to back-map ports and masks to pins.
void PCintPort::PCint() {
     28a:	ff 92       	push	r15
     28c:	0f 93       	push	r16
     28e:	1f 93       	push	r17
     290:	cf 93       	push	r28
     292:	df 93       	push	r29
     294:	ec 01       	movw	r28, r24
		PCintPort::s_lastPinView=lastPinView;
		intrCount++;
		PCintPort::s_count=intrCount;
		#endif
		uint8_t changedPins = (PCintPort::curr ^ lastPinView) &
							  ((portRisingPins & PCintPort::curr ) | ( portFallingPins & ~PCintPort::curr ));
     296:	20 91 8b 01 	lds	r18, 0x018B
     29a:	8f 81       	ldd	r24, Y+7	; 0x07
     29c:	3d 81       	ldd	r19, Y+5	; 0x05
     29e:	90 91 8b 01 	lds	r25, 0x018B
     2a2:	4e 81       	ldd	r20, Y+6	; 0x06
     2a4:	f0 90 8b 01 	lds	r15, 0x018B
     2a8:	f0 94       	com	r15
     2aa:	f4 22       	and	r15, r20
     2ac:	93 23       	and	r25, r19
     2ae:	f9 2a       	or	r15, r25
     2b0:	82 27       	eor	r24, r18
     2b2:	f8 22       	and	r15, r24
		#ifdef PINMODE
		PCintPort::s_currXORlastPinView=PCintPort::curr ^ lastPinView;
		PCintPort::s_portRisingPins_nCurr=portRisingPins & PCintPort::curr;
		PCintPort::s_portFallingPins_nNCurr=portFallingPins & ~PCintPort::curr;
		#endif
		lastPinView = PCintPort::curr;
     2b4:	80 91 8b 01 	lds	r24, 0x018B
     2b8:	8f 83       	std	Y+7, r24	; 0x07

		PCintPin* p = firstPin;
     2ba:	08 85       	ldd	r16, Y+8	; 0x08
     2bc:	19 85       	ldd	r17, Y+9	; 0x09
		while (p) {
     2be:	01 15       	cp	r16, r1
     2c0:	11 05       	cpc	r17, r1
     2c2:	e1 f0       	breq	.+56     	; 0x2fc <_ZN9PCintPort5PCintEv+0x72>
			// Trigger interrupt if the bit is high and it's set to trigger on mode RISING or CHANGE
			// Trigger interrupt if the bit is low and it's set to trigger on mode FALLING or CHANGE
			if (p->mask & changedPins) {
     2c4:	d8 01       	movw	r26, r16
     2c6:	13 96       	adiw	r26, 0x03	; 3
     2c8:	9c 91       	ld	r25, X
     2ca:	8f 2d       	mov	r24, r15
     2cc:	89 23       	and	r24, r25
     2ce:	81 f0       	breq	.+32     	; 0x2f0 <_ZN9PCintPort5PCintEv+0x66>
				#ifndef NO_PIN_STATE
				PCintPort::pinState=PCintPort::curr & p->mask ? HIGH : LOW;
     2d0:	80 91 8b 01 	lds	r24, 0x018B
     2d4:	89 23       	and	r24, r25
     2d6:	91 e0       	ldi	r25, 0x01	; 1
     2d8:	09 f4       	brne	.+2      	; 0x2dc <_ZN9PCintPort5PCintEv+0x52>
     2da:	90 e0       	ldi	r25, 0x00	; 0
     2dc:	90 93 89 01 	sts	0x0189, r25
				#endif
				#ifndef NO_PIN_NUMBER
				PCintPort::arduinoPin=p->arduinoPin;
     2e0:	f8 01       	movw	r30, r16
     2e2:	84 81       	ldd	r24, Z+4	; 0x04
     2e4:	80 93 8a 01 	sts	0x018A, r24
				PCintPort::s_portRisingPins=portRisingPins;
				PCintPort::s_portFallingPins=portFallingPins;
				PCintPort::s_pmask=p->mask;
				PCintPort::s_changedPins=changedPins;
				#endif
				p->PCintFunc();
     2e8:	01 90       	ld	r0, Z+
     2ea:	f0 81       	ld	r31, Z
     2ec:	e0 2d       	mov	r30, r0
     2ee:	09 95       	icall
			}
			p=p->next;
     2f0:	d8 01       	movw	r26, r16
     2f2:	15 96       	adiw	r26, 0x05	; 5
     2f4:	0d 91       	ld	r16, X+
     2f6:	1c 91       	ld	r17, X
     2f8:	16 97       	sbiw	r26, 0x06	; 6
     2fa:	e1 cf       	rjmp	.-62     	; 0x2be <_ZN9PCintPort5PCintEv+0x34>
		}
	#ifndef DISABLE_PCINT_MULTI_SERVICE
		pcifr = PCIFR & PCICRbit;
     2fc:	8b b3       	in	r24, 0x1b	; 27
     2fe:	9c 81       	ldd	r25, Y+4	; 0x04
     300:	89 23       	and	r24, r25
		if (pcifr == 0) break;
     302:	49 f0       	breq	.+18     	; 0x316 <_ZN9PCintPort5PCintEv+0x8c>
		PCIFR |= PCICRbit;
     304:	8b b3       	in	r24, 0x1b	; 27
     306:	89 2b       	or	r24, r25
     308:	8b bb       	out	0x1b, r24	; 27
		#ifdef PINMODE
		PCintPort::pcint_multi++;
		if (PCIFR & PCICRbit) PCintPort::PCIFRbug=1; // PCIFR & PCICRbit should ALWAYS be 0 here!
		#endif
		PCintPort::curr=portInputReg;
     30a:	e8 81       	ld	r30, Y
     30c:	f9 81       	ldd	r31, Y+1	; 0x01
     30e:	80 81       	ld	r24, Z
     310:	80 93 8b 01 	sts	0x018B, r24
	}
     314:	c0 cf       	rjmp	.-128    	; 0x296 <_ZN9PCintPort5PCintEv+0xc>
	#endif
}
     316:	df 91       	pop	r29
     318:	cf 91       	pop	r28
     31a:	1f 91       	pop	r17
     31c:	0f 91       	pop	r16
     31e:	ff 90       	pop	r15
     320:	08 95       	ret

00000322 <__vector_3>:
#define PORTCVECT PCINT1_vect
#define PORTDVECT PCINT2_vect
#endif

#ifndef NO_PORTB_PINCHANGES
ISR(PORTBVECT) {
     322:	1f 92       	push	r1
     324:	0f 92       	push	r0
     326:	0f b6       	in	r0, 0x3f	; 63
     328:	0f 92       	push	r0
     32a:	11 24       	eor	r1, r1
     32c:	2f 93       	push	r18
     32e:	3f 93       	push	r19
     330:	4f 93       	push	r20
     332:	5f 93       	push	r21
     334:	6f 93       	push	r22
     336:	7f 93       	push	r23
     338:	8f 93       	push	r24
     33a:	9f 93       	push	r25
     33c:	af 93       	push	r26
     33e:	bf 93       	push	r27
     340:	ef 93       	push	r30
     342:	ff 93       	push	r31
	#ifdef PINMODE
	PCintPort::s_PORT='B';
	#endif
	PCintPort::curr = portB.portInputReg;
     344:	e0 91 7f 01 	lds	r30, 0x017F
     348:	f0 91 80 01 	lds	r31, 0x0180
     34c:	80 81       	ld	r24, Z
     34e:	80 93 8b 01 	sts	0x018B, r24
	portB.PCint();
     352:	8f e7       	ldi	r24, 0x7F	; 127
     354:	91 e0       	ldi	r25, 0x01	; 1
     356:	0e 94 45 01 	call	0x28a	; 0x28a <_ZN9PCintPort5PCintEv>
}
     35a:	ff 91       	pop	r31
     35c:	ef 91       	pop	r30
     35e:	bf 91       	pop	r27
     360:	af 91       	pop	r26
     362:	9f 91       	pop	r25
     364:	8f 91       	pop	r24
     366:	7f 91       	pop	r23
     368:	6f 91       	pop	r22
     36a:	5f 91       	pop	r21
     36c:	4f 91       	pop	r20
     36e:	3f 91       	pop	r19
     370:	2f 91       	pop	r18
     372:	0f 90       	pop	r0
     374:	0f be       	out	0x3f, r0	; 63
     376:	0f 90       	pop	r0
     378:	1f 90       	pop	r1
     37a:	18 95       	reti

0000037c <__vector_4>:
#endif

#ifndef NO_PORTC_PINCHANGES
ISR(PORTCVECT) {
     37c:	1f 92       	push	r1
     37e:	0f 92       	push	r0
     380:	0f b6       	in	r0, 0x3f	; 63
     382:	0f 92       	push	r0
     384:	11 24       	eor	r1, r1
     386:	2f 93       	push	r18
     388:	3f 93       	push	r19
     38a:	4f 93       	push	r20
     38c:	5f 93       	push	r21
     38e:	6f 93       	push	r22
     390:	7f 93       	push	r23
     392:	8f 93       	push	r24
     394:	9f 93       	push	r25
     396:	af 93       	push	r26
     398:	bf 93       	push	r27
     39a:	ef 93       	push	r30
     39c:	ff 93       	push	r31
	#ifdef PINMODE
	PCintPort::s_PORT='C';
	#endif
	PCintPort::curr = portC.portInputReg;
     39e:	e0 91 75 01 	lds	r30, 0x0175
     3a2:	f0 91 76 01 	lds	r31, 0x0176
     3a6:	80 81       	ld	r24, Z
     3a8:	80 93 8b 01 	sts	0x018B, r24
	portC.PCint();
     3ac:	85 e7       	ldi	r24, 0x75	; 117
     3ae:	91 e0       	ldi	r25, 0x01	; 1
     3b0:	0e 94 45 01 	call	0x28a	; 0x28a <_ZN9PCintPort5PCintEv>
}
     3b4:	ff 91       	pop	r31
     3b6:	ef 91       	pop	r30
     3b8:	bf 91       	pop	r27
     3ba:	af 91       	pop	r26
     3bc:	9f 91       	pop	r25
     3be:	8f 91       	pop	r24
     3c0:	7f 91       	pop	r23
     3c2:	6f 91       	pop	r22
     3c4:	5f 91       	pop	r21
     3c6:	4f 91       	pop	r20
     3c8:	3f 91       	pop	r19
     3ca:	2f 91       	pop	r18
     3cc:	0f 90       	pop	r0
     3ce:	0f be       	out	0x3f, r0	; 63
     3d0:	0f 90       	pop	r0
     3d2:	1f 90       	pop	r1
     3d4:	18 95       	reti

000003d6 <__vector_5>:
#endif

#ifndef NO_PORTD_PINCHANGES
ISR(PORTDVECT){ 
     3d6:	1f 92       	push	r1
     3d8:	0f 92       	push	r0
     3da:	0f b6       	in	r0, 0x3f	; 63
     3dc:	0f 92       	push	r0
     3de:	11 24       	eor	r1, r1
     3e0:	2f 93       	push	r18
     3e2:	3f 93       	push	r19
     3e4:	4f 93       	push	r20
     3e6:	5f 93       	push	r21
     3e8:	6f 93       	push	r22
     3ea:	7f 93       	push	r23
     3ec:	8f 93       	push	r24
     3ee:	9f 93       	push	r25
     3f0:	af 93       	push	r26
     3f2:	bf 93       	push	r27
     3f4:	ef 93       	push	r30
     3f6:	ff 93       	push	r31
	#ifdef PINMODE
	PCintPort::s_PORT='D';
	#endif
	PCintPort::curr = portD.portInputReg;
     3f8:	e0 91 6b 01 	lds	r30, 0x016B
     3fc:	f0 91 6c 01 	lds	r31, 0x016C
     400:	80 81       	ld	r24, Z
     402:	80 93 8b 01 	sts	0x018B, r24
	portD.PCint();
     406:	8b e6       	ldi	r24, 0x6B	; 107
     408:	91 e0       	ldi	r25, 0x01	; 1
     40a:	0e 94 45 01 	call	0x28a	; 0x28a <_ZN9PCintPort5PCintEv>
}
     40e:	ff 91       	pop	r31
     410:	ef 91       	pop	r30
     412:	bf 91       	pop	r27
     414:	af 91       	pop	r26
     416:	9f 91       	pop	r25
     418:	8f 91       	pop	r24
     41a:	7f 91       	pop	r23
     41c:	6f 91       	pop	r22
     41e:	5f 91       	pop	r21
     420:	4f 91       	pop	r20
     422:	3f 91       	pop	r19
     424:	2f 91       	pop	r18
     426:	0f 90       	pop	r0
     428:	0f be       	out	0x3f, r0	; 63
     42a:	0f 90       	pop	r0
     42c:	1f 90       	pop	r1
     42e:	18 95       	reti

00000430 <setup>:
     430:	62 e0       	ldi	r22, 0x02	; 2
     432:	82 e1       	ldi	r24, 0x12	; 18
     434:	0e 94 6d 03 	call	0x6da	; 0x6da <pinMode>
     438:	42 e0       	ldi	r20, 0x02	; 2
     43a:	50 e0       	ldi	r21, 0x00	; 0
     43c:	63 e8       	ldi	r22, 0x83	; 131
     43e:	70 e0       	ldi	r23, 0x00	; 0
     440:	82 e1       	ldi	r24, 0x12	; 18
     442:	0e 94 20 01 	call	0x240	; 0x240 <_ZN9PCintPort15attachInterruptEhPFvvEi>
     446:	40 e0       	ldi	r20, 0x00	; 0
     448:	52 ec       	ldi	r21, 0xC2	; 194
     44a:	61 e0       	ldi	r22, 0x01	; 1
     44c:	70 e0       	ldi	r23, 0x00	; 0
     44e:	85 e9       	ldi	r24, 0x95	; 149
     450:	91 e0       	ldi	r25, 0x01	; 1
     452:	0e 94 bc 04 	call	0x978	; 0x978 <_ZN14HardwareSerial5beginEm>
     456:	66 e0       	ldi	r22, 0x06	; 6
     458:	71 e0       	ldi	r23, 0x01	; 1
     45a:	85 e9       	ldi	r24, 0x95	; 149
     45c:	91 e0       	ldi	r25, 0x01	; 1
     45e:	0c 94 ee 05 	jmp	0xbdc	; 0xbdc <_ZN5Print7printlnEPKc>

00000462 <loop>:
     462:	4a e0       	ldi	r20, 0x0A	; 10
     464:	50 e0       	ldi	r21, 0x00	; 0
     466:	69 e6       	ldi	r22, 0x69	; 105
     468:	70 e0       	ldi	r23, 0x00	; 0
     46a:	85 e9       	ldi	r24, 0x95	; 149
     46c:	91 e0       	ldi	r25, 0x01	; 1
     46e:	0e 94 a3 06 	call	0xd46	; 0xd46 <_ZN5Print7printlnEii>
     472:	68 ee       	ldi	r22, 0xE8	; 232
     474:	73 e0       	ldi	r23, 0x03	; 3
     476:	80 e0       	ldi	r24, 0x00	; 0
     478:	90 e0       	ldi	r25, 0x00	; 0
     47a:	0e 94 0c 03 	call	0x618	; 0x618 <delay>
     47e:	6e e2       	ldi	r22, 0x2E	; 46
     480:	71 e0       	ldi	r23, 0x01	; 1
     482:	85 e9       	ldi	r24, 0x95	; 149
     484:	91 e0       	ldi	r25, 0x01	; 1
     486:	0e 94 d1 05 	call	0xba2	; 0xba2 <_ZN5Print5printEPKc>
     48a:	60 91 6a 01 	lds	r22, 0x016A
     48e:	4a e0       	ldi	r20, 0x0A	; 10
     490:	50 e0       	ldi	r21, 0x00	; 0
     492:	85 e9       	ldi	r24, 0x95	; 149
     494:	91 e0       	ldi	r25, 0x01	; 1
     496:	0e 94 c8 06 	call	0xd90	; 0xd90 <_ZN5Print5printEhi>
     49a:	64 e4       	ldi	r22, 0x44	; 68
     49c:	71 e0       	ldi	r23, 0x01	; 1
     49e:	85 e9       	ldi	r24, 0x95	; 149
     4a0:	91 e0       	ldi	r25, 0x01	; 1
     4a2:	0c 94 ee 05 	jmp	0xbdc	; 0xbdc <_ZN5Print7printlnEPKc>

000004a6 <_GLOBAL__sub_I__ZN9PCintPort4currE>:
	// portB=PCintPort(2, 1,PCMSK1);
	// index:   portInputReg(*portInputRegister(index)), 
	// pcindex: PCICRbit(1 << pcindex)
	// maskReg: portPCMask(maskReg)
	PCintPort(int index,int pcindex, volatile uint8_t& maskReg) :
	portInputReg(*portInputRegister(index)),
     4a6:	e4 e9       	ldi	r30, 0x94	; 148
     4a8:	f0 e0       	ldi	r31, 0x00	; 0
     4aa:	85 91       	lpm	r24, Z+
     4ac:	94 91       	lpm	r25, Z
	portPCMask(maskReg),
	PCICRbit(1 << pcindex),
	portRisingPins(0),
	portFallingPins(0),
	firstPin(NULL)
     4ae:	90 93 80 01 	sts	0x0180, r25
     4b2:	80 93 7f 01 	sts	0x017F, r24
     4b6:	8b e6       	ldi	r24, 0x6B	; 107
     4b8:	90 e0       	ldi	r25, 0x00	; 0
     4ba:	90 93 82 01 	sts	0x0182, r25
     4be:	80 93 81 01 	sts	0x0181, r24
     4c2:	81 e0       	ldi	r24, 0x01	; 1
     4c4:	80 93 83 01 	sts	0x0183, r24
     4c8:	10 92 84 01 	sts	0x0184, r1
     4cc:	10 92 85 01 	sts	0x0185, r1
     4d0:	10 92 88 01 	sts	0x0188, r1
     4d4:	10 92 87 01 	sts	0x0187, r1
	// portB=PCintPort(2, 1,PCMSK1);
	// index:   portInputReg(*portInputRegister(index)), 
	// pcindex: PCICRbit(1 << pcindex)
	// maskReg: portPCMask(maskReg)
	PCintPort(int index,int pcindex, volatile uint8_t& maskReg) :
	portInputReg(*portInputRegister(index)),
     4d8:	e6 e9       	ldi	r30, 0x96	; 150
     4da:	f0 e0       	ldi	r31, 0x00	; 0
     4dc:	85 91       	lpm	r24, Z+
     4de:	94 91       	lpm	r25, Z
	portPCMask(maskReg),
	PCICRbit(1 << pcindex),
	portRisingPins(0),
	portFallingPins(0),
	firstPin(NULL)
     4e0:	90 93 76 01 	sts	0x0176, r25
     4e4:	80 93 75 01 	sts	0x0175, r24
     4e8:	8c e6       	ldi	r24, 0x6C	; 108
     4ea:	90 e0       	ldi	r25, 0x00	; 0
     4ec:	90 93 78 01 	sts	0x0178, r25
     4f0:	80 93 77 01 	sts	0x0177, r24
     4f4:	82 e0       	ldi	r24, 0x02	; 2
     4f6:	80 93 79 01 	sts	0x0179, r24
     4fa:	10 92 7a 01 	sts	0x017A, r1
     4fe:	10 92 7b 01 	sts	0x017B, r1
     502:	10 92 7e 01 	sts	0x017E, r1
     506:	10 92 7d 01 	sts	0x017D, r1
	// portB=PCintPort(2, 1,PCMSK1);
	// index:   portInputReg(*portInputRegister(index)), 
	// pcindex: PCICRbit(1 << pcindex)
	// maskReg: portPCMask(maskReg)
	PCintPort(int index,int pcindex, volatile uint8_t& maskReg) :
	portInputReg(*portInputRegister(index)),
     50a:	e8 e9       	ldi	r30, 0x98	; 152
     50c:	f0 e0       	ldi	r31, 0x00	; 0
     50e:	85 91       	lpm	r24, Z+
     510:	94 91       	lpm	r25, Z
	portPCMask(maskReg),
	PCICRbit(1 << pcindex),
	portRisingPins(0),
	portFallingPins(0),
	firstPin(NULL)
     512:	90 93 6c 01 	sts	0x016C, r25
     516:	80 93 6b 01 	sts	0x016B, r24
     51a:	8d e6       	ldi	r24, 0x6D	; 109
     51c:	90 e0       	ldi	r25, 0x00	; 0
     51e:	90 93 6e 01 	sts	0x016E, r25
     522:	80 93 6d 01 	sts	0x016D, r24
     526:	84 e0       	ldi	r24, 0x04	; 4
     528:	80 93 6f 01 	sts	0x016F, r24
     52c:	10 92 70 01 	sts	0x0170, r1
     530:	10 92 71 01 	sts	0x0171, r1
     534:	10 92 74 01 	sts	0x0174, r1
     538:	10 92 73 01 	sts	0x0173, r1
     53c:	08 95       	ret

0000053e <__vector_16>:
#if defined(__AVR_ATtiny24__) || defined(__AVR_ATtiny44__) || defined(__AVR_ATtiny84__)
ISR(TIM0_OVF_vect)
#else
ISR(TIMER0_OVF_vect)
#endif
{
     53e:	1f 92       	push	r1
     540:	0f 92       	push	r0
     542:	0f b6       	in	r0, 0x3f	; 63
     544:	0f 92       	push	r0
     546:	11 24       	eor	r1, r1
     548:	2f 93       	push	r18
     54a:	3f 93       	push	r19
     54c:	8f 93       	push	r24
     54e:	9f 93       	push	r25
     550:	af 93       	push	r26
     552:	bf 93       	push	r27
	// copy these to local variables so they can be stored in registers
	// (volatile variables must be read from memory on every access)
	unsigned long m = timer0_millis;
     554:	80 91 8d 01 	lds	r24, 0x018D
     558:	90 91 8e 01 	lds	r25, 0x018E
     55c:	a0 91 8f 01 	lds	r26, 0x018F
     560:	b0 91 90 01 	lds	r27, 0x0190
	unsigned char f = timer0_fract;
     564:	30 91 8c 01 	lds	r19, 0x018C

	m += MILLIS_INC;
	f += FRACT_INC;
     568:	23 e0       	ldi	r18, 0x03	; 3
     56a:	23 0f       	add	r18, r19
	if (f >= FRACT_MAX) {
     56c:	2d 37       	cpi	r18, 0x7D	; 125
     56e:	20 f4       	brcc	.+8      	; 0x578 <__vector_16+0x3a>
	// copy these to local variables so they can be stored in registers
	// (volatile variables must be read from memory on every access)
	unsigned long m = timer0_millis;
	unsigned char f = timer0_fract;

	m += MILLIS_INC;
     570:	01 96       	adiw	r24, 0x01	; 1
     572:	a1 1d       	adc	r26, r1
     574:	b1 1d       	adc	r27, r1
     576:	05 c0       	rjmp	.+10     	; 0x582 <__vector_16+0x44>
	f += FRACT_INC;
	if (f >= FRACT_MAX) {
		f -= FRACT_MAX;
     578:	26 e8       	ldi	r18, 0x86	; 134
     57a:	23 0f       	add	r18, r19
		m += 1;
     57c:	02 96       	adiw	r24, 0x02	; 2
     57e:	a1 1d       	adc	r26, r1
     580:	b1 1d       	adc	r27, r1
	}

	timer0_fract = f;
     582:	20 93 8c 01 	sts	0x018C, r18
	timer0_millis = m;
     586:	80 93 8d 01 	sts	0x018D, r24
     58a:	90 93 8e 01 	sts	0x018E, r25
     58e:	a0 93 8f 01 	sts	0x018F, r26
     592:	b0 93 90 01 	sts	0x0190, r27
	timer0_overflow_count++;
     596:	80 91 91 01 	lds	r24, 0x0191
     59a:	90 91 92 01 	lds	r25, 0x0192
     59e:	a0 91 93 01 	lds	r26, 0x0193
     5a2:	b0 91 94 01 	lds	r27, 0x0194
     5a6:	01 96       	adiw	r24, 0x01	; 1
     5a8:	a1 1d       	adc	r26, r1
     5aa:	b1 1d       	adc	r27, r1
     5ac:	80 93 91 01 	sts	0x0191, r24
     5b0:	90 93 92 01 	sts	0x0192, r25
     5b4:	a0 93 93 01 	sts	0x0193, r26
     5b8:	b0 93 94 01 	sts	0x0194, r27
}
     5bc:	bf 91       	pop	r27
     5be:	af 91       	pop	r26
     5c0:	9f 91       	pop	r25
     5c2:	8f 91       	pop	r24
     5c4:	3f 91       	pop	r19
     5c6:	2f 91       	pop	r18
     5c8:	0f 90       	pop	r0
     5ca:	0f be       	out	0x3f, r0	; 63
     5cc:	0f 90       	pop	r0
     5ce:	1f 90       	pop	r1
     5d0:	18 95       	reti

000005d2 <micros>:
	return m;
}

unsigned long micros() {
	unsigned long m;
	uint8_t oldSREG = SREG, t;
     5d2:	3f b7       	in	r19, 0x3f	; 63
	
	cli();
     5d4:	f8 94       	cli
	m = timer0_overflow_count;
     5d6:	80 91 91 01 	lds	r24, 0x0191
     5da:	90 91 92 01 	lds	r25, 0x0192
     5de:	a0 91 93 01 	lds	r26, 0x0193
     5e2:	b0 91 94 01 	lds	r27, 0x0194
#if defined(TCNT0)
	t = TCNT0;
     5e6:	26 b5       	in	r18, 0x26	; 38
	#error TIMER 0 not defined
#endif

  
#ifdef TIFR0
	if ((TIFR0 & _BV(TOV0)) && (t < 255))
     5e8:	a8 9b       	sbis	0x15, 0	; 21
     5ea:	05 c0       	rjmp	.+10     	; 0x5f6 <micros+0x24>
     5ec:	2f 3f       	cpi	r18, 0xFF	; 255
     5ee:	19 f0       	breq	.+6      	; 0x5f6 <micros+0x24>
		m++;
     5f0:	01 96       	adiw	r24, 0x01	; 1
     5f2:	a1 1d       	adc	r26, r1
     5f4:	b1 1d       	adc	r27, r1
#else
	if ((TIFR & _BV(TOV0)) && (t < 255))
		m++;
#endif

	SREG = oldSREG;
     5f6:	3f bf       	out	0x3f, r19	; 63
	
	return ((m << 8) + t) * (64 / clockCyclesPerMicrosecond());
     5f8:	66 27       	eor	r22, r22
     5fa:	78 2f       	mov	r23, r24
     5fc:	89 2f       	mov	r24, r25
     5fe:	9a 2f       	mov	r25, r26
     600:	62 0f       	add	r22, r18
     602:	71 1d       	adc	r23, r1
     604:	81 1d       	adc	r24, r1
     606:	91 1d       	adc	r25, r1
     608:	42 e0       	ldi	r20, 0x02	; 2
     60a:	66 0f       	add	r22, r22
     60c:	77 1f       	adc	r23, r23
     60e:	88 1f       	adc	r24, r24
     610:	99 1f       	adc	r25, r25
     612:	4a 95       	dec	r20
     614:	d1 f7       	brne	.-12     	; 0x60a <micros+0x38>
}
     616:	08 95       	ret

00000618 <delay>:

void delay(unsigned long ms)
{
     618:	cf 92       	push	r12
     61a:	df 92       	push	r13
     61c:	ef 92       	push	r14
     61e:	ff 92       	push	r15
     620:	cf 93       	push	r28
     622:	df 93       	push	r29
     624:	6b 01       	movw	r12, r22
     626:	7c 01       	movw	r14, r24
	uint16_t start = (uint16_t)micros();
     628:	0e 94 e9 02 	call	0x5d2	; 0x5d2 <micros>
     62c:	eb 01       	movw	r28, r22

	while (ms > 0) {
     62e:	c1 14       	cp	r12, r1
     630:	d1 04       	cpc	r13, r1
     632:	e1 04       	cpc	r14, r1
     634:	f1 04       	cpc	r15, r1
     636:	79 f0       	breq	.+30     	; 0x656 <delay+0x3e>
		if (((uint16_t)micros() - start) >= 1000) {
     638:	0e 94 e9 02 	call	0x5d2	; 0x5d2 <micros>
     63c:	6c 1b       	sub	r22, r28
     63e:	7d 0b       	sbc	r23, r29
     640:	68 3e       	cpi	r22, 0xE8	; 232
     642:	73 40       	sbci	r23, 0x03	; 3
     644:	a0 f3       	brcs	.-24     	; 0x62e <delay+0x16>
			ms--;
     646:	81 e0       	ldi	r24, 0x01	; 1
     648:	c8 1a       	sub	r12, r24
     64a:	d1 08       	sbc	r13, r1
     64c:	e1 08       	sbc	r14, r1
     64e:	f1 08       	sbc	r15, r1
			start += 1000;
     650:	c8 51       	subi	r28, 0x18	; 24
     652:	dc 4f       	sbci	r29, 0xFC	; 252
     654:	ec cf       	rjmp	.-40     	; 0x62e <delay+0x16>
		}
	}
}
     656:	df 91       	pop	r29
     658:	cf 91       	pop	r28
     65a:	ff 90       	pop	r15
     65c:	ef 90       	pop	r14
     65e:	df 90       	pop	r13
     660:	cf 90       	pop	r12
     662:	08 95       	ret

00000664 <init>:

void init()
{
	// this needs to be called before setup() or some functions won't
	// work there
	sei();
     664:	78 94       	sei
	
	// on the ATmega168, timer 0 is also used for fast hardware pwm
	// (using phase-correct PWM would mean that timer 0 overflowed half as often
	// resulting in different millis() behavior on the ATmega8 and ATmega168)
#if defined(TCCR0A) && defined(WGM01)
	sbi(TCCR0A, WGM01);
     666:	84 b5       	in	r24, 0x24	; 36
     668:	82 60       	ori	r24, 0x02	; 2
     66a:	84 bd       	out	0x24, r24	; 36
	sbi(TCCR0A, WGM00);
     66c:	84 b5       	in	r24, 0x24	; 36
     66e:	81 60       	ori	r24, 0x01	; 1
     670:	84 bd       	out	0x24, r24	; 36
	// this combination is for the standard atmega8
	sbi(TCCR0, CS01);
	sbi(TCCR0, CS00);
#elif defined(TCCR0B) && defined(CS01) && defined(CS00)
	// this combination is for the standard 168/328/1280/2560
	sbi(TCCR0B, CS01);
     672:	85 b5       	in	r24, 0x25	; 37
     674:	82 60       	ori	r24, 0x02	; 2
     676:	85 bd       	out	0x25, r24	; 37
	sbi(TCCR0B, CS00);
     678:	85 b5       	in	r24, 0x25	; 37
     67a:	81 60       	ori	r24, 0x01	; 1
     67c:	85 bd       	out	0x25, r24	; 37

	// enable timer 0 overflow interrupt
#if defined(TIMSK) && defined(TOIE0)
	sbi(TIMSK, TOIE0);
#elif defined(TIMSK0) && defined(TOIE0)
	sbi(TIMSK0, TOIE0);
     67e:	ee e6       	ldi	r30, 0x6E	; 110
     680:	f0 e0       	ldi	r31, 0x00	; 0
     682:	80 81       	ld	r24, Z
     684:	81 60       	ori	r24, 0x01	; 1
     686:	80 83       	st	Z, r24
	// this is better for motors as it ensures an even waveform
	// note, however, that fast pwm mode can achieve a frequency of up
	// 8 MHz (with a 16 MHz clock) at 50% duty cycle

#if defined(TCCR1B) && defined(CS11) && defined(CS10)
	TCCR1B = 0;
     688:	e1 e8       	ldi	r30, 0x81	; 129
     68a:	f0 e0       	ldi	r31, 0x00	; 0
     68c:	10 82       	st	Z, r1

	// set timer 1 prescale factor to 64
	sbi(TCCR1B, CS11);
     68e:	80 81       	ld	r24, Z
     690:	82 60       	ori	r24, 0x02	; 2
     692:	80 83       	st	Z, r24
#if F_CPU >= 8000000L
	sbi(TCCR1B, CS10);
     694:	80 81       	ld	r24, Z
     696:	81 60       	ori	r24, 0x01	; 1
     698:	80 83       	st	Z, r24
	sbi(TCCR1, CS10);
#endif
#endif
	// put timer 1 in 8-bit phase correct pwm mode
#if defined(TCCR1A) && defined(WGM10)
	sbi(TCCR1A, WGM10);
     69a:	e0 e8       	ldi	r30, 0x80	; 128
     69c:	f0 e0       	ldi	r31, 0x00	; 0
     69e:	80 81       	ld	r24, Z
     6a0:	81 60       	ori	r24, 0x01	; 1
     6a2:	80 83       	st	Z, r24

	// set timer 2 prescale factor to 64
#if defined(TCCR2) && defined(CS22)
	sbi(TCCR2, CS22);
#elif defined(TCCR2B) && defined(CS22)
	sbi(TCCR2B, CS22);
     6a4:	e1 eb       	ldi	r30, 0xB1	; 177
     6a6:	f0 e0       	ldi	r31, 0x00	; 0
     6a8:	80 81       	ld	r24, Z
     6aa:	84 60       	ori	r24, 0x04	; 4
     6ac:	80 83       	st	Z, r24

	// configure timer 2 for phase correct pwm (8-bit)
#if defined(TCCR2) && defined(WGM20)
	sbi(TCCR2, WGM20);
#elif defined(TCCR2A) && defined(WGM20)
	sbi(TCCR2A, WGM20);
     6ae:	e0 eb       	ldi	r30, 0xB0	; 176
     6b0:	f0 e0       	ldi	r31, 0x00	; 0
     6b2:	80 81       	ld	r24, Z
     6b4:	81 60       	ori	r24, 0x01	; 1
     6b6:	80 83       	st	Z, r24
#if defined(ADCSRA)
	// set a2d prescale factor to 128
	// 16 MHz / 128 = 125 KHz, inside the desired 50-200 KHz range.
	// XXX: this will not work properly for other clock speeds, and
	// this code should use F_CPU to determine the prescale factor.
	sbi(ADCSRA, ADPS2);
     6b8:	ea e7       	ldi	r30, 0x7A	; 122
     6ba:	f0 e0       	ldi	r31, 0x00	; 0
     6bc:	80 81       	ld	r24, Z
     6be:	84 60       	ori	r24, 0x04	; 4
     6c0:	80 83       	st	Z, r24
	sbi(ADCSRA, ADPS1);
     6c2:	80 81       	ld	r24, Z
     6c4:	82 60       	ori	r24, 0x02	; 2
     6c6:	80 83       	st	Z, r24
	sbi(ADCSRA, ADPS0);
     6c8:	80 81       	ld	r24, Z
     6ca:	81 60       	ori	r24, 0x01	; 1
     6cc:	80 83       	st	Z, r24

	// enable a2d conversions
	sbi(ADCSRA, ADEN);
     6ce:	80 81       	ld	r24, Z
     6d0:	80 68       	ori	r24, 0x80	; 128
     6d2:	80 83       	st	Z, r24
	// here so they can be used as normal digital i/o; they will be
	// reconnected in Serial.begin()
#if defined(UCSRB)
	UCSRB = 0;
#elif defined(UCSR0B)
	UCSR0B = 0;
     6d4:	10 92 c1 00 	sts	0x00C1, r1
     6d8:	08 95       	ret

000006da <pinMode>:
#define ARDUINO_MAIN
#include "wiring_private.h"
#include "pins_arduino.h"

void pinMode(uint8_t pin, uint8_t mode)
{
     6da:	cf 93       	push	r28
     6dc:	df 93       	push	r29
	uint8_t bit = digitalPinToBitMask(pin);
     6de:	90 e0       	ldi	r25, 0x00	; 0
     6e0:	fc 01       	movw	r30, r24
     6e2:	e8 59       	subi	r30, 0x98	; 152
     6e4:	ff 4f       	sbci	r31, 0xFF	; 255
     6e6:	24 91       	lpm	r18, Z
	uint8_t port = digitalPinToPort(pin);
     6e8:	fc 01       	movw	r30, r24
     6ea:	e4 58       	subi	r30, 0x84	; 132
     6ec:	ff 4f       	sbci	r31, 0xFF	; 255
     6ee:	84 91       	lpm	r24, Z
	volatile uint8_t *reg, *out;

	if (port == NOT_A_PIN) return;
     6f0:	88 23       	and	r24, r24
     6f2:	49 f1       	breq	.+82     	; 0x746 <pinMode+0x6c>

	// JWS: can I let the optimizer do this?
	reg = portModeRegister(port);
     6f4:	90 e0       	ldi	r25, 0x00	; 0
     6f6:	88 0f       	add	r24, r24
     6f8:	99 1f       	adc	r25, r25
     6fa:	fc 01       	movw	r30, r24
     6fc:	ec 55       	subi	r30, 0x5C	; 92
     6fe:	ff 4f       	sbci	r31, 0xFF	; 255
     700:	a5 91       	lpm	r26, Z+
     702:	b4 91       	lpm	r27, Z
	out = portOutputRegister(port);
     704:	86 56       	subi	r24, 0x66	; 102
     706:	9f 4f       	sbci	r25, 0xFF	; 255
     708:	fc 01       	movw	r30, r24
     70a:	c5 91       	lpm	r28, Z+
     70c:	d4 91       	lpm	r29, Z

	if (mode == INPUT) { 
		uint8_t oldSREG = SREG;
     70e:	9f b7       	in	r25, 0x3f	; 63

	// JWS: can I let the optimizer do this?
	reg = portModeRegister(port);
	out = portOutputRegister(port);

	if (mode == INPUT) { 
     710:	61 11       	cpse	r22, r1
     712:	08 c0       	rjmp	.+16     	; 0x724 <pinMode+0x4a>
		uint8_t oldSREG = SREG;
                cli();
     714:	f8 94       	cli
		*reg &= ~bit;
     716:	8c 91       	ld	r24, X
     718:	20 95       	com	r18
     71a:	82 23       	and	r24, r18
     71c:	8c 93       	st	X, r24
		*out &= ~bit;
     71e:	88 81       	ld	r24, Y
     720:	82 23       	and	r24, r18
     722:	0a c0       	rjmp	.+20     	; 0x738 <pinMode+0x5e>
		SREG = oldSREG;
	} else if (mode == INPUT_PULLUP) {
     724:	62 30       	cpi	r22, 0x02	; 2
     726:	51 f4       	brne	.+20     	; 0x73c <pinMode+0x62>
		uint8_t oldSREG = SREG;
                cli();
     728:	f8 94       	cli
		*reg &= ~bit;
     72a:	8c 91       	ld	r24, X
     72c:	32 2f       	mov	r19, r18
     72e:	30 95       	com	r19
     730:	83 23       	and	r24, r19
     732:	8c 93       	st	X, r24
		*out |= bit;
     734:	88 81       	ld	r24, Y
     736:	82 2b       	or	r24, r18
     738:	88 83       	st	Y, r24
     73a:	04 c0       	rjmp	.+8      	; 0x744 <pinMode+0x6a>
		SREG = oldSREG;
	} else {
		uint8_t oldSREG = SREG;
                cli();
     73c:	f8 94       	cli
		*reg |= bit;
     73e:	8c 91       	ld	r24, X
     740:	82 2b       	or	r24, r18
     742:	8c 93       	st	X, r24
		SREG = oldSREG;
     744:	9f bf       	out	0x3f, r25	; 63
	}
}
     746:	df 91       	pop	r29
     748:	cf 91       	pop	r28
     74a:	08 95       	ret

0000074c <_ZN14HardwareSerial9availableEv>:
  _rx_buffer->head = _rx_buffer->tail;
}

int HardwareSerial::available(void)
{
  return (unsigned int)(SERIAL_BUFFER_SIZE + _rx_buffer->head - _rx_buffer->tail) % SERIAL_BUFFER_SIZE;
     74c:	fc 01       	movw	r30, r24
     74e:	24 85       	ldd	r18, Z+12	; 0x0c
     750:	35 85       	ldd	r19, Z+13	; 0x0d
     752:	f9 01       	movw	r30, r18
     754:	e0 5c       	subi	r30, 0xC0	; 192
     756:	ff 4f       	sbci	r31, 0xFF	; 255
     758:	80 81       	ld	r24, Z
     75a:	91 81       	ldd	r25, Z+1	; 0x01
     75c:	f9 01       	movw	r30, r18
     75e:	ee 5b       	subi	r30, 0xBE	; 190
     760:	ff 4f       	sbci	r31, 0xFF	; 255
     762:	20 81       	ld	r18, Z
     764:	31 81       	ldd	r19, Z+1	; 0x01
     766:	82 1b       	sub	r24, r18
     768:	93 0b       	sbc	r25, r19
}
     76a:	8f 73       	andi	r24, 0x3F	; 63
     76c:	99 27       	eor	r25, r25
     76e:	08 95       	ret

00000770 <_ZN14HardwareSerial4peekEv>:

int HardwareSerial::peek(void)
{
  if (_rx_buffer->head == _rx_buffer->tail) {
     770:	fc 01       	movw	r30, r24
     772:	84 85       	ldd	r24, Z+12	; 0x0c
     774:	95 85       	ldd	r25, Z+13	; 0x0d
     776:	fc 01       	movw	r30, r24
     778:	e0 5c       	subi	r30, 0xC0	; 192
     77a:	ff 4f       	sbci	r31, 0xFF	; 255
     77c:	40 81       	ld	r20, Z
     77e:	51 81       	ldd	r21, Z+1	; 0x01
     780:	fc 01       	movw	r30, r24
     782:	ee 5b       	subi	r30, 0xBE	; 190
     784:	ff 4f       	sbci	r31, 0xFF	; 255
     786:	20 81       	ld	r18, Z
     788:	31 81       	ldd	r19, Z+1	; 0x01
     78a:	42 17       	cp	r20, r18
     78c:	53 07       	cpc	r21, r19
     78e:	41 f0       	breq	.+16     	; 0x7a0 <_ZN14HardwareSerial4peekEv+0x30>
    return -1;
  } else {
    return _rx_buffer->buffer[_rx_buffer->tail];
     790:	01 90       	ld	r0, Z+
     792:	f0 81       	ld	r31, Z
     794:	e0 2d       	mov	r30, r0
     796:	e8 0f       	add	r30, r24
     798:	f9 1f       	adc	r31, r25
     79a:	80 81       	ld	r24, Z
     79c:	90 e0       	ldi	r25, 0x00	; 0
     79e:	08 95       	ret
}

int HardwareSerial::peek(void)
{
  if (_rx_buffer->head == _rx_buffer->tail) {
    return -1;
     7a0:	8f ef       	ldi	r24, 0xFF	; 255
     7a2:	9f ef       	ldi	r25, 0xFF	; 255
  } else {
    return _rx_buffer->buffer[_rx_buffer->tail];
  }
}
     7a4:	08 95       	ret

000007a6 <_ZN14HardwareSerial4readEv>:

int HardwareSerial::read(void)
{
  // if the head isn't ahead of the tail, we don't have any characters
  if (_rx_buffer->head == _rx_buffer->tail) {
     7a6:	fc 01       	movw	r30, r24
     7a8:	84 85       	ldd	r24, Z+12	; 0x0c
     7aa:	95 85       	ldd	r25, Z+13	; 0x0d
     7ac:	fc 01       	movw	r30, r24
     7ae:	e0 5c       	subi	r30, 0xC0	; 192
     7b0:	ff 4f       	sbci	r31, 0xFF	; 255
     7b2:	40 81       	ld	r20, Z
     7b4:	51 81       	ldd	r21, Z+1	; 0x01
     7b6:	fc 01       	movw	r30, r24
     7b8:	ee 5b       	subi	r30, 0xBE	; 190
     7ba:	ff 4f       	sbci	r31, 0xFF	; 255
     7bc:	20 81       	ld	r18, Z
     7be:	31 81       	ldd	r19, Z+1	; 0x01
     7c0:	42 17       	cp	r20, r18
     7c2:	53 07       	cpc	r21, r19
     7c4:	79 f0       	breq	.+30     	; 0x7e4 <_ZN14HardwareSerial4readEv+0x3e>
    return -1;
  } else {
    unsigned char c = _rx_buffer->buffer[_rx_buffer->tail];
     7c6:	a0 81       	ld	r26, Z
     7c8:	b1 81       	ldd	r27, Z+1	; 0x01
     7ca:	a8 0f       	add	r26, r24
     7cc:	b9 1f       	adc	r27, r25
     7ce:	8c 91       	ld	r24, X
    _rx_buffer->tail = (unsigned int)(_rx_buffer->tail + 1) % SERIAL_BUFFER_SIZE;
     7d0:	20 81       	ld	r18, Z
     7d2:	31 81       	ldd	r19, Z+1	; 0x01
     7d4:	2f 5f       	subi	r18, 0xFF	; 255
     7d6:	3f 4f       	sbci	r19, 0xFF	; 255
     7d8:	2f 73       	andi	r18, 0x3F	; 63
     7da:	33 27       	eor	r19, r19
     7dc:	31 83       	std	Z+1, r19	; 0x01
     7de:	20 83       	st	Z, r18
    return c;
     7e0:	90 e0       	ldi	r25, 0x00	; 0
     7e2:	08 95       	ret

int HardwareSerial::read(void)
{
  // if the head isn't ahead of the tail, we don't have any characters
  if (_rx_buffer->head == _rx_buffer->tail) {
    return -1;
     7e4:	8f ef       	ldi	r24, 0xFF	; 255
     7e6:	9f ef       	ldi	r25, 0xFF	; 255
  } else {
    unsigned char c = _rx_buffer->buffer[_rx_buffer->tail];
    _rx_buffer->tail = (unsigned int)(_rx_buffer->tail + 1) % SERIAL_BUFFER_SIZE;
    return c;
  }
}
     7e8:	08 95       	ret

000007ea <_ZN14HardwareSerial5flushEv>:

void HardwareSerial::flush()
{
     7ea:	fc 01       	movw	r30, r24
  // UDR is kept full while the buffer is not empty, so TXC triggers when EMPTY && SENT
  while (transmitting && ! (*_ucsra & _BV(TXC0)));
     7ec:	81 a1       	ldd	r24, Z+33	; 0x21
     7ee:	88 23       	and	r24, r24
     7f0:	29 f0       	breq	.+10     	; 0x7fc <_ZN14HardwareSerial5flushEv+0x12>
     7f2:	a4 89       	ldd	r26, Z+20	; 0x14
     7f4:	b5 89       	ldd	r27, Z+21	; 0x15
     7f6:	8c 91       	ld	r24, X
     7f8:	86 ff       	sbrs	r24, 6
     7fa:	fb cf       	rjmp	.-10     	; 0x7f2 <_ZN14HardwareSerial5flushEv+0x8>
  transmitting = false;
     7fc:	11 a2       	std	Z+33, r1	; 0x21
     7fe:	08 95       	ret

00000800 <_ZN14HardwareSerial5writeEh>:
}

size_t HardwareSerial::write(uint8_t c)
{
     800:	cf 93       	push	r28
     802:	df 93       	push	r29
     804:	fc 01       	movw	r30, r24
  int i = (_tx_buffer->head + 1) % SERIAL_BUFFER_SIZE;
     806:	26 85       	ldd	r18, Z+14	; 0x0e
     808:	37 85       	ldd	r19, Z+15	; 0x0f
     80a:	d9 01       	movw	r26, r18
     80c:	a0 5c       	subi	r26, 0xC0	; 192
     80e:	bf 4f       	sbci	r27, 0xFF	; 255
     810:	8d 91       	ld	r24, X+
     812:	9c 91       	ld	r25, X
     814:	11 97       	sbiw	r26, 0x01	; 1
     816:	01 96       	adiw	r24, 0x01	; 1
     818:	8f 73       	andi	r24, 0x3F	; 63
     81a:	99 27       	eor	r25, r25
	
  // If the output buffer is full, there's nothing for it other than to 
  // wait for the interrupt handler to empty it a bit
  // ???: return 0 here instead?
  while (i == _tx_buffer->tail)
     81c:	e9 01       	movw	r28, r18
     81e:	ce 5b       	subi	r28, 0xBE	; 190
     820:	df 4f       	sbci	r29, 0xFF	; 255
     822:	48 81       	ld	r20, Y
     824:	59 81       	ldd	r21, Y+1	; 0x01
     826:	84 17       	cp	r24, r20
     828:	95 07       	cpc	r25, r21
     82a:	d9 f3       	breq	.-10     	; 0x822 <_ZN14HardwareSerial5writeEh+0x22>
    ;
	
  _tx_buffer->buffer[_tx_buffer->head] = c;
     82c:	0d 90       	ld	r0, X+
     82e:	bc 91       	ld	r27, X
     830:	a0 2d       	mov	r26, r0
     832:	a2 0f       	add	r26, r18
     834:	b3 1f       	adc	r27, r19
     836:	6c 93       	st	X, r22
  _tx_buffer->head = i;
     838:	a6 85       	ldd	r26, Z+14	; 0x0e
     83a:	b7 85       	ldd	r27, Z+15	; 0x0f
     83c:	a0 5c       	subi	r26, 0xC0	; 192
     83e:	bf 4f       	sbci	r27, 0xFF	; 255
     840:	11 96       	adiw	r26, 0x01	; 1
     842:	9c 93       	st	X, r25
     844:	8e 93       	st	-X, r24
	
  sbi(*_ucsrb, _udrie);
     846:	a6 89       	ldd	r26, Z+22	; 0x16
     848:	b7 89       	ldd	r27, Z+23	; 0x17
     84a:	2c 91       	ld	r18, X
     84c:	81 e0       	ldi	r24, 0x01	; 1
     84e:	90 e0       	ldi	r25, 0x00	; 0
     850:	07 8c       	ldd	r0, Z+31	; 0x1f
     852:	02 c0       	rjmp	.+4      	; 0x858 <_ZN14HardwareSerial5writeEh+0x58>
     854:	88 0f       	add	r24, r24
     856:	99 1f       	adc	r25, r25
     858:	0a 94       	dec	r0
     85a:	e2 f7       	brpl	.-8      	; 0x854 <_ZN14HardwareSerial5writeEh+0x54>
     85c:	28 2b       	or	r18, r24
     85e:	2c 93       	st	X, r18
  // clear the TXC bit -- "can be cleared by writing a one to its bit location"
  transmitting = true;
     860:	81 e0       	ldi	r24, 0x01	; 1
     862:	81 a3       	std	Z+33, r24	; 0x21
  sbi(*_ucsra, TXC0);
     864:	04 88       	ldd	r0, Z+20	; 0x14
     866:	f5 89       	ldd	r31, Z+21	; 0x15
     868:	e0 2d       	mov	r30, r0
     86a:	80 81       	ld	r24, Z
     86c:	80 64       	ori	r24, 0x40	; 64
     86e:	80 83       	st	Z, r24
  
  return 1;
}
     870:	81 e0       	ldi	r24, 0x01	; 1
     872:	90 e0       	ldi	r25, 0x00	; 0
     874:	df 91       	pop	r29
     876:	cf 91       	pop	r28
     878:	08 95       	ret

0000087a <_Z11serialEventv>:
#if !defined(USART_RX_vect) && !defined(USART0_RX_vect) && \
    !defined(USART_RXC_vect)
  #error "Don't know what the Data Received vector is called for the first UART"
#else
  void serialEvent() __attribute__((weak));
  void serialEvent() {}
     87a:	08 95       	ret

0000087c <__vector_18>:
#elif defined(USART0_RX_vect)
  ISR(USART0_RX_vect)
#elif defined(USART_RXC_vect)
  ISR(USART_RXC_vect) // ATmega8
#endif
  {
     87c:	1f 92       	push	r1
     87e:	0f 92       	push	r0
     880:	0f b6       	in	r0, 0x3f	; 63
     882:	0f 92       	push	r0
     884:	11 24       	eor	r1, r1
     886:	2f 93       	push	r18
     888:	3f 93       	push	r19
     88a:	4f 93       	push	r20
     88c:	8f 93       	push	r24
     88e:	9f 93       	push	r25
     890:	ef 93       	push	r30
     892:	ff 93       	push	r31
  #if defined(UDR0)
    if (bit_is_clear(UCSR0A, UPE0)) {
     894:	80 91 c0 00 	lds	r24, 0x00C0
     898:	82 fd       	sbrc	r24, 2
     89a:	1c c0       	rjmp	.+56     	; 0x8d4 <__vector_18+0x58>
      unsigned char c = UDR0;
     89c:	40 91 c6 00 	lds	r20, 0x00C6
  ring_buffer tx_buffer3  =  { { 0 }, 0, 0 };
#endif

inline void store_char(unsigned char c, ring_buffer *buffer)
{
  int i = (unsigned int)(buffer->head + 1) % SERIAL_BUFFER_SIZE;
     8a0:	80 91 3b 02 	lds	r24, 0x023B
     8a4:	90 91 3c 02 	lds	r25, 0x023C
     8a8:	01 96       	adiw	r24, 0x01	; 1
     8aa:	8f 73       	andi	r24, 0x3F	; 63
     8ac:	99 27       	eor	r25, r25

  // if we should be storing the received character into the location
  // just before the tail (meaning that the head would advance to the
  // current location of the tail), we're about to overflow the buffer
  // and so we don't write the character or advance the head.
  if (i != buffer->tail) {
     8ae:	20 91 3d 02 	lds	r18, 0x023D
     8b2:	30 91 3e 02 	lds	r19, 0x023E
     8b6:	82 17       	cp	r24, r18
     8b8:	93 07       	cpc	r25, r19
     8ba:	71 f0       	breq	.+28     	; 0x8d8 <__vector_18+0x5c>
    buffer->buffer[buffer->head] = c;
     8bc:	e0 91 3b 02 	lds	r30, 0x023B
     8c0:	f0 91 3c 02 	lds	r31, 0x023C
     8c4:	e5 50       	subi	r30, 0x05	; 5
     8c6:	fe 4f       	sbci	r31, 0xFE	; 254
     8c8:	40 83       	st	Z, r20
    buffer->head = i;
     8ca:	90 93 3c 02 	sts	0x023C, r25
     8ce:	80 93 3b 02 	sts	0x023B, r24
     8d2:	02 c0       	rjmp	.+4      	; 0x8d8 <__vector_18+0x5c>
  #if defined(UDR0)
    if (bit_is_clear(UCSR0A, UPE0)) {
      unsigned char c = UDR0;
      store_char(c, &rx_buffer);
    } else {
      unsigned char c = UDR0;
     8d4:	80 91 c6 00 	lds	r24, 0x00C6
      unsigned char c = UDR;
    };
  #else
    #error UDR not defined
  #endif
  }
     8d8:	ff 91       	pop	r31
     8da:	ef 91       	pop	r30
     8dc:	9f 91       	pop	r25
     8de:	8f 91       	pop	r24
     8e0:	4f 91       	pop	r20
     8e2:	3f 91       	pop	r19
     8e4:	2f 91       	pop	r18
     8e6:	0f 90       	pop	r0
     8e8:	0f be       	out	0x3f, r0	; 63
     8ea:	0f 90       	pop	r0
     8ec:	1f 90       	pop	r1
     8ee:	18 95       	reti

000008f0 <_Z14serialEventRunv>:
#endif

void serialEventRun(void)
{
#ifdef serialEvent_implemented
  if (Serial.available()) serialEvent();
     8f0:	85 e9       	ldi	r24, 0x95	; 149
     8f2:	91 e0       	ldi	r25, 0x01	; 1
     8f4:	0e 94 a6 03 	call	0x74c	; 0x74c <_ZN14HardwareSerial9availableEv>
     8f8:	89 2b       	or	r24, r25
     8fa:	11 f0       	breq	.+4      	; 0x900 <__stack+0x1>
     8fc:	0c 94 3d 04 	jmp	0x87a	; 0x87a <_Z11serialEventv>
     900:	08 95       	ret

00000902 <__vector_19>:
#elif defined(USART0_UDRE_vect)
ISR(USART0_UDRE_vect)
#elif defined(USART_UDRE_vect)
ISR(USART_UDRE_vect)
#endif
{
     902:	1f 92       	push	r1
     904:	0f 92       	push	r0
     906:	0f b6       	in	r0, 0x3f	; 63
     908:	0f 92       	push	r0
     90a:	11 24       	eor	r1, r1
     90c:	2f 93       	push	r18
     90e:	3f 93       	push	r19
     910:	8f 93       	push	r24
     912:	9f 93       	push	r25
     914:	ef 93       	push	r30
     916:	ff 93       	push	r31
  if (tx_buffer.head == tx_buffer.tail) {
     918:	20 91 f7 01 	lds	r18, 0x01F7
     91c:	30 91 f8 01 	lds	r19, 0x01F8
     920:	80 91 f9 01 	lds	r24, 0x01F9
     924:	90 91 fa 01 	lds	r25, 0x01FA
     928:	28 17       	cp	r18, r24
     92a:	39 07       	cpc	r19, r25
     92c:	31 f4       	brne	.+12     	; 0x93a <__vector_19+0x38>
	// Buffer empty, so disable interrupts
#if defined(UCSR0B)
    cbi(UCSR0B, UDRIE0);
     92e:	80 91 c1 00 	lds	r24, 0x00C1
     932:	8f 7d       	andi	r24, 0xDF	; 223
     934:	80 93 c1 00 	sts	0x00C1, r24
     938:	14 c0       	rjmp	.+40     	; 0x962 <__vector_19+0x60>
    cbi(UCSRB, UDRIE);
#endif
  }
  else {
    // There is more data in the output buffer. Send the next byte
    unsigned char c = tx_buffer.buffer[tx_buffer.tail];
     93a:	e0 91 f9 01 	lds	r30, 0x01F9
     93e:	f0 91 fa 01 	lds	r31, 0x01FA
     942:	e9 54       	subi	r30, 0x49	; 73
     944:	fe 4f       	sbci	r31, 0xFE	; 254
     946:	20 81       	ld	r18, Z
    tx_buffer.tail = (tx_buffer.tail + 1) % SERIAL_BUFFER_SIZE;
     948:	80 91 f9 01 	lds	r24, 0x01F9
     94c:	90 91 fa 01 	lds	r25, 0x01FA
     950:	01 96       	adiw	r24, 0x01	; 1
     952:	8f 73       	andi	r24, 0x3F	; 63
     954:	99 27       	eor	r25, r25
     956:	90 93 fa 01 	sts	0x01FA, r25
     95a:	80 93 f9 01 	sts	0x01F9, r24
	
  #if defined(UDR0)
    UDR0 = c;
     95e:	20 93 c6 00 	sts	0x00C6, r18
    UDR = c;
  #else
    #error UDR not defined
  #endif
  }
}
     962:	ff 91       	pop	r31
     964:	ef 91       	pop	r30
     966:	9f 91       	pop	r25
     968:	8f 91       	pop	r24
     96a:	3f 91       	pop	r19
     96c:	2f 91       	pop	r18
     96e:	0f 90       	pop	r0
     970:	0f be       	out	0x3f, r0	; 63
     972:	0f 90       	pop	r0
     974:	1f 90       	pop	r1
     976:	18 95       	reti

00000978 <_ZN14HardwareSerial5beginEm>:
}

// Public Methods //////////////////////////////////////////////////////////////

void HardwareSerial::begin(unsigned long baud)
{
     978:	cf 92       	push	r12
     97a:	df 92       	push	r13
     97c:	ef 92       	push	r14
     97e:	ff 92       	push	r15
     980:	cf 93       	push	r28
     982:	df 93       	push	r29
     984:	ec 01       	movw	r28, r24
     986:	6a 01       	movw	r12, r20
     988:	7b 01       	movw	r14, r22
  }
#endif

try_again:
  
  if (use_u2x) {
     98a:	41 15       	cp	r20, r1
     98c:	81 ee       	ldi	r24, 0xE1	; 225
     98e:	58 07       	cpc	r21, r24
     990:	61 05       	cpc	r22, r1
     992:	71 05       	cpc	r23, r1
     994:	f9 f0       	breq	.+62     	; 0x9d4 <_ZN14HardwareSerial5beginEm+0x5c>
    *_ucsra = 1 << _u2x;
     996:	ec 89       	ldd	r30, Y+20	; 0x14
     998:	fd 89       	ldd	r31, Y+21	; 0x15
     99a:	81 e0       	ldi	r24, 0x01	; 1
     99c:	90 e0       	ldi	r25, 0x00	; 0
     99e:	08 a0       	ldd	r0, Y+32	; 0x20
     9a0:	02 c0       	rjmp	.+4      	; 0x9a6 <_ZN14HardwareSerial5beginEm+0x2e>
     9a2:	88 0f       	add	r24, r24
     9a4:	99 1f       	adc	r25, r25
     9a6:	0a 94       	dec	r0
     9a8:	e2 f7       	brpl	.-8      	; 0x9a2 <_ZN14HardwareSerial5beginEm+0x2a>
     9aa:	80 83       	st	Z, r24
    baud_setting = (F_CPU / 4 / baud - 1) / 2;
     9ac:	60 e0       	ldi	r22, 0x00	; 0
     9ae:	79 e0       	ldi	r23, 0x09	; 9
     9b0:	8d e3       	ldi	r24, 0x3D	; 61
     9b2:	90 e0       	ldi	r25, 0x00	; 0
     9b4:	a7 01       	movw	r20, r14
     9b6:	96 01       	movw	r18, r12
     9b8:	0e 94 05 08 	call	0x100a	; 0x100a <__udivmodsi4>
     9bc:	21 50       	subi	r18, 0x01	; 1
     9be:	31 09       	sbc	r19, r1
     9c0:	41 09       	sbc	r20, r1
     9c2:	51 09       	sbc	r21, r1
     9c4:	56 95       	lsr	r21
     9c6:	47 95       	ror	r20
     9c8:	37 95       	ror	r19
     9ca:	27 95       	ror	r18
  } else {
    *_ucsra = 0;
    baud_setting = (F_CPU / 8 / baud - 1) / 2;
  }
  
  if ((baud_setting > 4095) && use_u2x)
     9cc:	21 15       	cp	r18, r1
     9ce:	80 e1       	ldi	r24, 0x10	; 16
     9d0:	38 07       	cpc	r19, r24
     9d2:	98 f0       	brcs	.+38     	; 0x9fa <_ZN14HardwareSerial5beginEm+0x82>
  
  if (use_u2x) {
    *_ucsra = 1 << _u2x;
    baud_setting = (F_CPU / 4 / baud - 1) / 2;
  } else {
    *_ucsra = 0;
     9d4:	ec 89       	ldd	r30, Y+20	; 0x14
     9d6:	fd 89       	ldd	r31, Y+21	; 0x15
     9d8:	10 82       	st	Z, r1
    baud_setting = (F_CPU / 8 / baud - 1) / 2;
     9da:	60 e8       	ldi	r22, 0x80	; 128
     9dc:	74 e8       	ldi	r23, 0x84	; 132
     9de:	8e e1       	ldi	r24, 0x1E	; 30
     9e0:	90 e0       	ldi	r25, 0x00	; 0
     9e2:	a7 01       	movw	r20, r14
     9e4:	96 01       	movw	r18, r12
     9e6:	0e 94 05 08 	call	0x100a	; 0x100a <__udivmodsi4>
     9ea:	21 50       	subi	r18, 0x01	; 1
     9ec:	31 09       	sbc	r19, r1
     9ee:	41 09       	sbc	r20, r1
     9f0:	51 09       	sbc	r21, r1
     9f2:	56 95       	lsr	r21
     9f4:	47 95       	ror	r20
     9f6:	37 95       	ror	r19
     9f8:	27 95       	ror	r18
    use_u2x = false;
    goto try_again;
  }

  // assign the baud_setting, a.k.a. ubbr (USART Baud Rate Register)
  *_ubrrh = baud_setting >> 8;
     9fa:	e8 89       	ldd	r30, Y+16	; 0x10
     9fc:	f9 89       	ldd	r31, Y+17	; 0x11
     9fe:	30 83       	st	Z, r19
  *_ubrrl = baud_setting;
     a00:	ea 89       	ldd	r30, Y+18	; 0x12
     a02:	fb 89       	ldd	r31, Y+19	; 0x13
     a04:	20 83       	st	Z, r18

  transmitting = false;
     a06:	19 a2       	std	Y+33, r1	; 0x21

  sbi(*_ucsrb, _rxen);
     a08:	ee 89       	ldd	r30, Y+22	; 0x16
     a0a:	ff 89       	ldd	r31, Y+23	; 0x17
     a0c:	40 81       	ld	r20, Z
     a0e:	81 e0       	ldi	r24, 0x01	; 1
     a10:	90 e0       	ldi	r25, 0x00	; 0
     a12:	9c 01       	movw	r18, r24
     a14:	0c 8c       	ldd	r0, Y+28	; 0x1c
     a16:	02 c0       	rjmp	.+4      	; 0xa1c <_ZN14HardwareSerial5beginEm+0xa4>
     a18:	22 0f       	add	r18, r18
     a1a:	33 1f       	adc	r19, r19
     a1c:	0a 94       	dec	r0
     a1e:	e2 f7       	brpl	.-8      	; 0xa18 <_ZN14HardwareSerial5beginEm+0xa0>
     a20:	42 2b       	or	r20, r18
     a22:	40 83       	st	Z, r20
  sbi(*_ucsrb, _txen);
     a24:	ee 89       	ldd	r30, Y+22	; 0x16
     a26:	ff 89       	ldd	r31, Y+23	; 0x17
     a28:	40 81       	ld	r20, Z
     a2a:	9c 01       	movw	r18, r24
     a2c:	0d 8c       	ldd	r0, Y+29	; 0x1d
     a2e:	02 c0       	rjmp	.+4      	; 0xa34 <_ZN14HardwareSerial5beginEm+0xbc>
     a30:	22 0f       	add	r18, r18
     a32:	33 1f       	adc	r19, r19
     a34:	0a 94       	dec	r0
     a36:	e2 f7       	brpl	.-8      	; 0xa30 <_ZN14HardwareSerial5beginEm+0xb8>
     a38:	42 2b       	or	r20, r18
     a3a:	40 83       	st	Z, r20
  sbi(*_ucsrb, _rxcie);
     a3c:	ee 89       	ldd	r30, Y+22	; 0x16
     a3e:	ff 89       	ldd	r31, Y+23	; 0x17
     a40:	40 81       	ld	r20, Z
     a42:	9c 01       	movw	r18, r24
     a44:	0e 8c       	ldd	r0, Y+30	; 0x1e
     a46:	02 c0       	rjmp	.+4      	; 0xa4c <_ZN14HardwareSerial5beginEm+0xd4>
     a48:	22 0f       	add	r18, r18
     a4a:	33 1f       	adc	r19, r19
     a4c:	0a 94       	dec	r0
     a4e:	e2 f7       	brpl	.-8      	; 0xa48 <_ZN14HardwareSerial5beginEm+0xd0>
     a50:	42 2b       	or	r20, r18
     a52:	40 83       	st	Z, r20
  cbi(*_ucsrb, _udrie);
     a54:	ee 89       	ldd	r30, Y+22	; 0x16
     a56:	ff 89       	ldd	r31, Y+23	; 0x17
     a58:	20 81       	ld	r18, Z
     a5a:	0f 8c       	ldd	r0, Y+31	; 0x1f
     a5c:	02 c0       	rjmp	.+4      	; 0xa62 <_ZN14HardwareSerial5beginEm+0xea>
     a5e:	88 0f       	add	r24, r24
     a60:	99 1f       	adc	r25, r25
     a62:	0a 94       	dec	r0
     a64:	e2 f7       	brpl	.-8      	; 0xa5e <_ZN14HardwareSerial5beginEm+0xe6>
     a66:	80 95       	com	r24
     a68:	82 23       	and	r24, r18
     a6a:	80 83       	st	Z, r24
}
     a6c:	df 91       	pop	r29
     a6e:	cf 91       	pop	r28
     a70:	ff 90       	pop	r15
     a72:	ef 90       	pop	r14
     a74:	df 90       	pop	r13
     a76:	cf 90       	pop	r12
     a78:	08 95       	ret

00000a7a <_GLOBAL__sub_I_rx_buffer>:
    size_t printNumber(unsigned long, uint8_t);
    size_t printFloat(double, uint8_t);
  protected:
    void setWriteError(int err = 1) { write_error = err; }
  public:
    Print() : write_error(0) {}
     a7a:	10 92 98 01 	sts	0x0198, r1
     a7e:	10 92 97 01 	sts	0x0197, r1
    virtual int available() = 0;
    virtual int read() = 0;
    virtual int peek() = 0;
    virtual void flush() = 0;

    Stream() {_timeout=1000;}
     a82:	88 ee       	ldi	r24, 0xE8	; 232
     a84:	93 e0       	ldi	r25, 0x03	; 3
     a86:	a0 e0       	ldi	r26, 0x00	; 0
     a88:	b0 e0       	ldi	r27, 0x00	; 0
     a8a:	80 93 99 01 	sts	0x0199, r24
     a8e:	90 93 9a 01 	sts	0x019A, r25
     a92:	a0 93 9b 01 	sts	0x019B, r26
     a96:	b0 93 9c 01 	sts	0x019C, r27

HardwareSerial::HardwareSerial(ring_buffer *rx_buffer, ring_buffer *tx_buffer,
  volatile uint8_t *ubrrh, volatile uint8_t *ubrrl,
  volatile uint8_t *ucsra, volatile uint8_t *ucsrb,
  volatile uint8_t *ucsrc, volatile uint8_t *udr,
  uint8_t rxen, uint8_t txen, uint8_t rxcie, uint8_t udrie, uint8_t u2x)
     a9a:	8d e5       	ldi	r24, 0x5D	; 93
     a9c:	91 e0       	ldi	r25, 0x01	; 1
     a9e:	90 93 96 01 	sts	0x0196, r25
     aa2:	80 93 95 01 	sts	0x0195, r24
{
  _rx_buffer = rx_buffer;
     aa6:	8b ef       	ldi	r24, 0xFB	; 251
     aa8:	91 e0       	ldi	r25, 0x01	; 1
     aaa:	90 93 a2 01 	sts	0x01A2, r25
     aae:	80 93 a1 01 	sts	0x01A1, r24
  _tx_buffer = tx_buffer;
     ab2:	87 eb       	ldi	r24, 0xB7	; 183
     ab4:	91 e0       	ldi	r25, 0x01	; 1
     ab6:	90 93 a4 01 	sts	0x01A4, r25
     aba:	80 93 a3 01 	sts	0x01A3, r24
  _ubrrh = ubrrh;
     abe:	85 ec       	ldi	r24, 0xC5	; 197
     ac0:	90 e0       	ldi	r25, 0x00	; 0
     ac2:	90 93 a6 01 	sts	0x01A6, r25
     ac6:	80 93 a5 01 	sts	0x01A5, r24
  _ubrrl = ubrrl;
     aca:	84 ec       	ldi	r24, 0xC4	; 196
     acc:	90 e0       	ldi	r25, 0x00	; 0
     ace:	90 93 a8 01 	sts	0x01A8, r25
     ad2:	80 93 a7 01 	sts	0x01A7, r24
  _ucsra = ucsra;
     ad6:	80 ec       	ldi	r24, 0xC0	; 192
     ad8:	90 e0       	ldi	r25, 0x00	; 0
     ada:	90 93 aa 01 	sts	0x01AA, r25
     ade:	80 93 a9 01 	sts	0x01A9, r24
  _ucsrb = ucsrb;
     ae2:	81 ec       	ldi	r24, 0xC1	; 193
     ae4:	90 e0       	ldi	r25, 0x00	; 0
     ae6:	90 93 ac 01 	sts	0x01AC, r25
     aea:	80 93 ab 01 	sts	0x01AB, r24
  _ucsrc = ucsrc;
     aee:	82 ec       	ldi	r24, 0xC2	; 194
     af0:	90 e0       	ldi	r25, 0x00	; 0
     af2:	90 93 ae 01 	sts	0x01AE, r25
     af6:	80 93 ad 01 	sts	0x01AD, r24
  _udr = udr;
     afa:	86 ec       	ldi	r24, 0xC6	; 198
     afc:	90 e0       	ldi	r25, 0x00	; 0
     afe:	90 93 b0 01 	sts	0x01B0, r25
     b02:	80 93 af 01 	sts	0x01AF, r24
  _rxen = rxen;
     b06:	84 e0       	ldi	r24, 0x04	; 4
     b08:	80 93 b1 01 	sts	0x01B1, r24
  _txen = txen;
     b0c:	83 e0       	ldi	r24, 0x03	; 3
     b0e:	80 93 b2 01 	sts	0x01B2, r24
  _rxcie = rxcie;
     b12:	87 e0       	ldi	r24, 0x07	; 7
     b14:	80 93 b3 01 	sts	0x01B3, r24
  _udrie = udrie;
     b18:	85 e0       	ldi	r24, 0x05	; 5
     b1a:	80 93 b4 01 	sts	0x01B4, r24
  _u2x = u2x;
     b1e:	81 e0       	ldi	r24, 0x01	; 1
     b20:	80 93 b5 01 	sts	0x01B5, r24
     b24:	08 95       	ret

00000b26 <_ZN5Print5writeEPKhj>:

// Public Methods //////////////////////////////////////////////////////////////

/* default implementation: may be overridden */
size_t Print::write(const uint8_t *buffer, size_t size)
{
     b26:	cf 92       	push	r12
     b28:	df 92       	push	r13
     b2a:	ef 92       	push	r14
     b2c:	ff 92       	push	r15
     b2e:	0f 93       	push	r16
     b30:	1f 93       	push	r17
     b32:	cf 93       	push	r28
     b34:	df 93       	push	r29
     b36:	6c 01       	movw	r12, r24
     b38:	7a 01       	movw	r14, r20
     b3a:	eb 01       	movw	r28, r22
     b3c:	e6 0e       	add	r14, r22
     b3e:	f7 1e       	adc	r15, r23
  size_t n = 0;
     b40:	00 e0       	ldi	r16, 0x00	; 0
     b42:	10 e0       	ldi	r17, 0x00	; 0
  while (size--) {
     b44:	ce 15       	cp	r28, r14
     b46:	df 05       	cpc	r29, r15
     b48:	61 f0       	breq	.+24     	; 0xb62 <_ZN5Print5writeEPKhj+0x3c>
    n += write(*buffer++);
     b4a:	69 91       	ld	r22, Y+
     b4c:	d6 01       	movw	r26, r12
     b4e:	ed 91       	ld	r30, X+
     b50:	fc 91       	ld	r31, X
     b52:	01 90       	ld	r0, Z+
     b54:	f0 81       	ld	r31, Z
     b56:	e0 2d       	mov	r30, r0
     b58:	c6 01       	movw	r24, r12
     b5a:	09 95       	icall
     b5c:	08 0f       	add	r16, r24
     b5e:	19 1f       	adc	r17, r25
     b60:	f1 cf       	rjmp	.-30     	; 0xb44 <_ZN5Print5writeEPKhj+0x1e>
  }
  return n;
}
     b62:	c8 01       	movw	r24, r16
     b64:	df 91       	pop	r29
     b66:	cf 91       	pop	r28
     b68:	1f 91       	pop	r17
     b6a:	0f 91       	pop	r16
     b6c:	ff 90       	pop	r15
     b6e:	ef 90       	pop	r14
     b70:	df 90       	pop	r13
     b72:	cf 90       	pop	r12
     b74:	08 95       	ret

00000b76 <_ZN5Print5writeEPKc>:
    int getWriteError() { return write_error; }
    void clearWriteError() { setWriteError(0); }
  
    virtual size_t write(uint8_t) = 0;
    size_t write(const char *str) {
      if (str == NULL) return 0;
     b76:	61 15       	cp	r22, r1
     b78:	71 05       	cpc	r23, r1
     b7a:	81 f0       	breq	.+32     	; 0xb9c <_ZN5Print5writeEPKc+0x26>
      return write((const uint8_t *)str, strlen(str));
     b7c:	db 01       	movw	r26, r22
     b7e:	0d 90       	ld	r0, X+
     b80:	00 20       	and	r0, r0
     b82:	e9 f7       	brne	.-6      	; 0xb7e <_ZN5Print5writeEPKc+0x8>
     b84:	ad 01       	movw	r20, r26
     b86:	41 50       	subi	r20, 0x01	; 1
     b88:	51 09       	sbc	r21, r1
     b8a:	46 1b       	sub	r20, r22
     b8c:	57 0b       	sbc	r21, r23
     b8e:	dc 01       	movw	r26, r24
     b90:	ed 91       	ld	r30, X+
     b92:	fc 91       	ld	r31, X
     b94:	02 80       	ldd	r0, Z+2	; 0x02
     b96:	f3 81       	ldd	r31, Z+3	; 0x03
     b98:	e0 2d       	mov	r30, r0
     b9a:	09 94       	ijmp
    }
     b9c:	80 e0       	ldi	r24, 0x00	; 0
     b9e:	90 e0       	ldi	r25, 0x00	; 0
     ba0:	08 95       	ret

00000ba2 <_ZN5Print5printEPKc>:
    size_t print(int, int = DEC);
    size_t print(unsigned int, int = DEC);
    size_t print(long, int = DEC);
    size_t print(unsigned long, int = DEC);
    size_t print(double, int = 2);
    size_t print(const Printable&);
     ba2:	0c 94 bb 05 	jmp	0xb76	; 0xb76 <_ZN5Print5writeEPKc>

00000ba6 <_ZN5Print5printEc>:

    size_t println(const __FlashStringHelper *);
    size_t println(const String &s);
    size_t println(const char[]);
    size_t println(char);
     ba6:	dc 01       	movw	r26, r24
     ba8:	ed 91       	ld	r30, X+
     baa:	fc 91       	ld	r31, X
     bac:	01 90       	ld	r0, Z+
     bae:	f0 81       	ld	r31, Z
     bb0:	e0 2d       	mov	r30, r0
     bb2:	09 94       	ijmp

00000bb4 <_ZN5Print7printlnEv>:
     bb4:	0f 93       	push	r16
     bb6:	1f 93       	push	r17
     bb8:	cf 93       	push	r28
     bba:	df 93       	push	r29
     bbc:	ec 01       	movw	r28, r24
     bbe:	6d e0       	ldi	r22, 0x0D	; 13
     bc0:	0e 94 d3 05 	call	0xba6	; 0xba6 <_ZN5Print5printEc>
     bc4:	8c 01       	movw	r16, r24
     bc6:	6a e0       	ldi	r22, 0x0A	; 10
     bc8:	ce 01       	movw	r24, r28
     bca:	0e 94 d3 05 	call	0xba6	; 0xba6 <_ZN5Print5printEc>
     bce:	80 0f       	add	r24, r16
     bd0:	91 1f       	adc	r25, r17
     bd2:	df 91       	pop	r29
     bd4:	cf 91       	pop	r28
     bd6:	1f 91       	pop	r17
     bd8:	0f 91       	pop	r16
     bda:	08 95       	ret

00000bdc <_ZN5Print7printlnEPKc>:
     bdc:	0f 93       	push	r16
     bde:	1f 93       	push	r17
     be0:	cf 93       	push	r28
     be2:	df 93       	push	r29
     be4:	ec 01       	movw	r28, r24
    size_t print(int, int = DEC);
    size_t print(unsigned int, int = DEC);
    size_t print(long, int = DEC);
    size_t print(unsigned long, int = DEC);
    size_t print(double, int = 2);
    size_t print(const Printable&);
     be6:	0e 94 bb 05 	call	0xb76	; 0xb76 <_ZN5Print5writeEPKc>
     bea:	8c 01       	movw	r16, r24
     bec:	ce 01       	movw	r24, r28
     bee:	0e 94 da 05 	call	0xbb4	; 0xbb4 <_ZN5Print7printlnEv>
     bf2:	80 0f       	add	r24, r16
     bf4:	91 1f       	adc	r25, r17
     bf6:	df 91       	pop	r29
     bf8:	cf 91       	pop	r28
     bfa:	1f 91       	pop	r17
     bfc:	0f 91       	pop	r16
     bfe:	08 95       	ret

00000c00 <_ZN5Print11printNumberEmh>:
     c00:	8f 92       	push	r8
     c02:	9f 92       	push	r9
     c04:	af 92       	push	r10
     c06:	bf 92       	push	r11
     c08:	cf 92       	push	r12
     c0a:	df 92       	push	r13
     c0c:	ef 92       	push	r14
     c0e:	ff 92       	push	r15
     c10:	0f 93       	push	r16
     c12:	1f 93       	push	r17
     c14:	cf 93       	push	r28
     c16:	df 93       	push	r29
     c18:	cd b7       	in	r28, 0x3d	; 61
     c1a:	de b7       	in	r29, 0x3e	; 62
     c1c:	a1 97       	sbiw	r28, 0x21	; 33
     c1e:	0f b6       	in	r0, 0x3f	; 63
     c20:	f8 94       	cli
     c22:	de bf       	out	0x3e, r29	; 62
     c24:	0f be       	out	0x3f, r0	; 63
     c26:	cd bf       	out	0x3d, r28	; 61
     c28:	7c 01       	movw	r14, r24
     c2a:	c4 2e       	mov	r12, r20
     c2c:	e5 2f       	mov	r30, r21
     c2e:	cb 01       	movw	r24, r22
     c30:	d2 2e       	mov	r13, r18
     c32:	19 a2       	std	Y+33, r1	; 0x21
     c34:	21 e0       	ldi	r18, 0x01	; 1
     c36:	2d 15       	cp	r18, r13
     c38:	10 f0       	brcs	.+4      	; 0xc3e <_ZN5Print11printNumberEmh+0x3e>
     c3a:	2a e0       	ldi	r18, 0x0A	; 10
     c3c:	d2 2e       	mov	r13, r18
     c3e:	8e 01       	movw	r16, r28
     c40:	0f 5d       	subi	r16, 0xDF	; 223
     c42:	1f 4f       	sbci	r17, 0xFF	; 255
     c44:	8d 2c       	mov	r8, r13
     c46:	91 2c       	mov	r9, r1
     c48:	a1 2c       	mov	r10, r1
     c4a:	b1 2c       	mov	r11, r1
     c4c:	6c 2d       	mov	r22, r12
     c4e:	7e 2f       	mov	r23, r30
     c50:	a5 01       	movw	r20, r10
     c52:	94 01       	movw	r18, r8
     c54:	0e 94 05 08 	call	0x100a	; 0x100a <__udivmodsi4>
     c58:	8c 2d       	mov	r24, r12
     c5a:	d2 9e       	mul	r13, r18
     c5c:	80 19       	sub	r24, r0
     c5e:	11 24       	eor	r1, r1
     c60:	01 50       	subi	r16, 0x01	; 1
     c62:	11 09       	sbc	r17, r1
     c64:	8a 30       	cpi	r24, 0x0A	; 10
     c66:	14 f4       	brge	.+4      	; 0xc6c <_ZN5Print11printNumberEmh+0x6c>
     c68:	80 5d       	subi	r24, 0xD0	; 208
     c6a:	01 c0       	rjmp	.+2      	; 0xc6e <_ZN5Print11printNumberEmh+0x6e>
     c6c:	89 5c       	subi	r24, 0xC9	; 201
     c6e:	f8 01       	movw	r30, r16
     c70:	80 83       	st	Z, r24
     c72:	21 15       	cp	r18, r1
     c74:	31 05       	cpc	r19, r1
     c76:	41 05       	cpc	r20, r1
     c78:	51 05       	cpc	r21, r1
     c7a:	21 f0       	breq	.+8      	; 0xc84 <_ZN5Print11printNumberEmh+0x84>
     c7c:	c2 2e       	mov	r12, r18
     c7e:	e3 2f       	mov	r30, r19
     c80:	ca 01       	movw	r24, r20
     c82:	e4 cf       	rjmp	.-56     	; 0xc4c <_ZN5Print11printNumberEmh+0x4c>
     c84:	b8 01       	movw	r22, r16
     c86:	c7 01       	movw	r24, r14
     c88:	0e 94 bb 05 	call	0xb76	; 0xb76 <_ZN5Print5writeEPKc>
     c8c:	a1 96       	adiw	r28, 0x21	; 33
     c8e:	0f b6       	in	r0, 0x3f	; 63
     c90:	f8 94       	cli
     c92:	de bf       	out	0x3e, r29	; 62
     c94:	0f be       	out	0x3f, r0	; 63
     c96:	cd bf       	out	0x3d, r28	; 61
     c98:	df 91       	pop	r29
     c9a:	cf 91       	pop	r28
     c9c:	1f 91       	pop	r17
     c9e:	0f 91       	pop	r16
     ca0:	ff 90       	pop	r15
     ca2:	ef 90       	pop	r14
     ca4:	df 90       	pop	r13
     ca6:	cf 90       	pop	r12
     ca8:	bf 90       	pop	r11
     caa:	af 90       	pop	r10
     cac:	9f 90       	pop	r9
     cae:	8f 90       	pop	r8
     cb0:	08 95       	ret

00000cb2 <_ZN5Print5printEli>:
     cb2:	cf 92       	push	r12
     cb4:	df 92       	push	r13
     cb6:	ef 92       	push	r14
     cb8:	ff 92       	push	r15
     cba:	0f 93       	push	r16
     cbc:	1f 93       	push	r17
     cbe:	cf 93       	push	r28
     cc0:	df 93       	push	r29
     cc2:	ec 01       	movw	r28, r24
     cc4:	6a 01       	movw	r12, r20
     cc6:	7b 01       	movw	r14, r22
     cc8:	21 15       	cp	r18, r1
     cca:	31 05       	cpc	r19, r1
     ccc:	79 f4       	brne	.+30     	; 0xcec <_ZN5Print5printEli+0x3a>
     cce:	e8 81       	ld	r30, Y
     cd0:	f9 81       	ldd	r31, Y+1	; 0x01
     cd2:	01 90       	ld	r0, Z+
     cd4:	f0 81       	ld	r31, Z
     cd6:	e0 2d       	mov	r30, r0
     cd8:	64 2f       	mov	r22, r20
     cda:	df 91       	pop	r29
     cdc:	cf 91       	pop	r28
     cde:	1f 91       	pop	r17
     ce0:	0f 91       	pop	r16
     ce2:	ff 90       	pop	r15
     ce4:	ef 90       	pop	r14
     ce6:	df 90       	pop	r13
     ce8:	cf 90       	pop	r12
     cea:	09 94       	ijmp
     cec:	2a 30       	cpi	r18, 0x0A	; 10
     cee:	31 05       	cpc	r19, r1
     cf0:	e9 f4       	brne	.+58     	; 0xd2c <_ZN5Print5printEli+0x7a>
     cf2:	77 ff       	sbrs	r23, 7
     cf4:	1a c0       	rjmp	.+52     	; 0xd2a <_ZN5Print5printEli+0x78>
     cf6:	6d e2       	ldi	r22, 0x2D	; 45
     cf8:	0e 94 d3 05 	call	0xba6	; 0xba6 <_ZN5Print5printEc>
     cfc:	8c 01       	movw	r16, r24
     cfe:	44 27       	eor	r20, r20
     d00:	55 27       	eor	r21, r21
     d02:	ba 01       	movw	r22, r20
     d04:	4c 19       	sub	r20, r12
     d06:	5d 09       	sbc	r21, r13
     d08:	6e 09       	sbc	r22, r14
     d0a:	7f 09       	sbc	r23, r15
     d0c:	2a e0       	ldi	r18, 0x0A	; 10
     d0e:	ce 01       	movw	r24, r28
     d10:	0e 94 00 06 	call	0xc00	; 0xc00 <_ZN5Print11printNumberEmh>
     d14:	80 0f       	add	r24, r16
     d16:	91 1f       	adc	r25, r17
     d18:	df 91       	pop	r29
     d1a:	cf 91       	pop	r28
     d1c:	1f 91       	pop	r17
     d1e:	0f 91       	pop	r16
     d20:	ff 90       	pop	r15
     d22:	ef 90       	pop	r14
     d24:	df 90       	pop	r13
     d26:	cf 90       	pop	r12
     d28:	08 95       	ret
     d2a:	2a e0       	ldi	r18, 0x0A	; 10
     d2c:	b7 01       	movw	r22, r14
     d2e:	a6 01       	movw	r20, r12
     d30:	ce 01       	movw	r24, r28
     d32:	df 91       	pop	r29
     d34:	cf 91       	pop	r28
     d36:	1f 91       	pop	r17
     d38:	0f 91       	pop	r16
     d3a:	ff 90       	pop	r15
     d3c:	ef 90       	pop	r14
     d3e:	df 90       	pop	r13
     d40:	cf 90       	pop	r12
     d42:	0c 94 00 06 	jmp	0xc00	; 0xc00 <_ZN5Print11printNumberEmh>

00000d46 <_ZN5Print7printlnEii>:
     d46:	0f 93       	push	r16
     d48:	1f 93       	push	r17
     d4a:	cf 93       	push	r28
     d4c:	df 93       	push	r29
     d4e:	ec 01       	movw	r28, r24
     d50:	9a 01       	movw	r18, r20
    size_t println(unsigned long, int = DEC);
    size_t println(double, int = 2);
    size_t println(const Printable&);
    size_t println(void);
};

     d52:	ab 01       	movw	r20, r22
     d54:	66 27       	eor	r22, r22
     d56:	57 fd       	sbrc	r21, 7
     d58:	60 95       	com	r22
     d5a:	76 2f       	mov	r23, r22
     d5c:	0e 94 59 06 	call	0xcb2	; 0xcb2 <_ZN5Print5printEli>
     d60:	8c 01       	movw	r16, r24
     d62:	ce 01       	movw	r24, r28
     d64:	0e 94 da 05 	call	0xbb4	; 0xbb4 <_ZN5Print7printlnEv>
     d68:	80 0f       	add	r24, r16
     d6a:	91 1f       	adc	r25, r17
     d6c:	df 91       	pop	r29
     d6e:	cf 91       	pop	r28
     d70:	1f 91       	pop	r17
     d72:	0f 91       	pop	r16
     d74:	08 95       	ret

00000d76 <_ZN5Print5printEmi>:
     d76:	21 15       	cp	r18, r1
     d78:	31 05       	cpc	r19, r1
     d7a:	41 f4       	brne	.+16     	; 0xd8c <_ZN5Print5printEmi+0x16>
     d7c:	dc 01       	movw	r26, r24
     d7e:	ed 91       	ld	r30, X+
     d80:	fc 91       	ld	r31, X
     d82:	01 90       	ld	r0, Z+
     d84:	f0 81       	ld	r31, Z
     d86:	e0 2d       	mov	r30, r0
     d88:	64 2f       	mov	r22, r20
     d8a:	09 94       	ijmp
     d8c:	0c 94 00 06 	jmp	0xc00	; 0xc00 <_ZN5Print11printNumberEmh>

00000d90 <_ZN5Print5printEhi>:
    size_t println(const char[]);
    size_t println(char);
    size_t println(unsigned char, int = DEC);
    size_t println(int, int = DEC);
    size_t println(unsigned int, int = DEC);
    size_t println(long, int = DEC);
     d90:	9a 01       	movw	r18, r20
    size_t println(unsigned long, int = DEC);
     d92:	46 2f       	mov	r20, r22
     d94:	50 e0       	ldi	r21, 0x00	; 0
     d96:	60 e0       	ldi	r22, 0x00	; 0
     d98:	70 e0       	ldi	r23, 0x00	; 0
     d9a:	0c 94 bb 06 	jmp	0xd76	; 0xd76 <_ZN5Print5printEmi>

00000d9e <main>:
#include <Arduino.h>

int main(void)
{
	init();
     d9e:	0e 94 32 03 	call	0x664	; 0x664 <init>

#if defined(USBCON)
	USBDevice.attach();
#endif
	
	setup();
     da2:	0e 94 18 02 	call	0x430	; 0x430 <setup>
    
	for (;;) {
		loop();
		if (serialEventRun) serialEventRun();
     da6:	c8 e7       	ldi	r28, 0x78	; 120
     da8:	d4 e0       	ldi	r29, 0x04	; 4
#endif
	
	setup();
    
	for (;;) {
		loop();
     daa:	0e 94 31 02 	call	0x462	; 0x462 <loop>
		if (serialEventRun) serialEventRun();
     dae:	20 97       	sbiw	r28, 0x00	; 0
     db0:	e1 f3       	breq	.-8      	; 0xdaa <main+0xc>
     db2:	0e 94 78 04 	call	0x8f0	; 0x8f0 <_Z14serialEventRunv>
     db6:	f9 cf       	rjmp	.-14     	; 0xdaa <main+0xc>

00000db8 <_Znwj>:
#include <new.h>

void * operator new(size_t size)
{
  return malloc(size);
     db8:	0c 94 de 06 	jmp	0xdbc	; 0xdbc <malloc>

00000dbc <malloc>:
struct __freelist *__flp;

ATTRIBUTE_CLIB_SECTION
void *
malloc(size_t len)
{
     dbc:	cf 93       	push	r28
     dbe:	df 93       	push	r29
	 * Our minimum chunk size is the size of a pointer (plus the
	 * size of the "sz" field, but we don't need to account for
	 * this), otherwise we could not possibly fit a freelist entry
	 * into the chunk later.
	 */
	if (len < sizeof(struct __freelist) - sizeof(size_t))
     dc0:	82 30       	cpi	r24, 0x02	; 2
     dc2:	91 05       	cpc	r25, r1
     dc4:	10 f4       	brcc	.+4      	; 0xdca <malloc+0xe>
		len = sizeof(struct __freelist) - sizeof(size_t);
     dc6:	82 e0       	ldi	r24, 0x02	; 2
     dc8:	90 e0       	ldi	r25, 0x00	; 0
	 * would match exactly.  If we found one, we are done.  While
	 * walking, note down the smallest chunk we found that would
	 * still fit the request -- we need it for step 2.
	 *
	 */
	for (s = 0, fp1 = __flp, fp2 = 0;
     dca:	e0 91 41 02 	lds	r30, 0x0241
     dce:	f0 91 42 02 	lds	r31, 0x0242
     dd2:	20 e0       	ldi	r18, 0x00	; 0
     dd4:	30 e0       	ldi	r19, 0x00	; 0
     dd6:	a0 e0       	ldi	r26, 0x00	; 0
     dd8:	b0 e0       	ldi	r27, 0x00	; 0
     dda:	30 97       	sbiw	r30, 0x00	; 0
     ddc:	39 f1       	breq	.+78     	; 0xe2c <malloc+0x70>
	     fp1;
	     fp2 = fp1, fp1 = fp1->nx) {
		if (fp1->sz < len)
     dde:	40 81       	ld	r20, Z
     de0:	51 81       	ldd	r21, Z+1	; 0x01
     de2:	48 17       	cp	r20, r24
     de4:	59 07       	cpc	r21, r25
     de6:	b8 f0       	brcs	.+46     	; 0xe16 <malloc+0x5a>
			continue;
		if (fp1->sz == len) {
     de8:	48 17       	cp	r20, r24
     dea:	59 07       	cpc	r21, r25
     dec:	71 f4       	brne	.+28     	; 0xe0a <malloc+0x4e>
     dee:	82 81       	ldd	r24, Z+2	; 0x02
     df0:	93 81       	ldd	r25, Z+3	; 0x03
			/*
			 * Found it.  Disconnect the chunk from the
			 * freelist, and return it.
			 */
			if (fp2)
     df2:	10 97       	sbiw	r26, 0x00	; 0
     df4:	29 f0       	breq	.+10     	; 0xe00 <malloc+0x44>
				fp2->nx = fp1->nx;
     df6:	13 96       	adiw	r26, 0x03	; 3
     df8:	9c 93       	st	X, r25
     dfa:	8e 93       	st	-X, r24
     dfc:	12 97       	sbiw	r26, 0x02	; 2
     dfe:	2c c0       	rjmp	.+88     	; 0xe58 <malloc+0x9c>
			else
				__flp = fp1->nx;
     e00:	90 93 42 02 	sts	0x0242, r25
     e04:	80 93 41 02 	sts	0x0241, r24
     e08:	27 c0       	rjmp	.+78     	; 0xe58 <malloc+0x9c>
			return &(fp1->nx);
		}
		else {
			if (s == 0 || fp1->sz < s) {
     e0a:	21 15       	cp	r18, r1
     e0c:	31 05       	cpc	r19, r1
     e0e:	31 f0       	breq	.+12     	; 0xe1c <malloc+0x60>
     e10:	42 17       	cp	r20, r18
     e12:	53 07       	cpc	r21, r19
     e14:	18 f0       	brcs	.+6      	; 0xe1c <malloc+0x60>
     e16:	a9 01       	movw	r20, r18
     e18:	db 01       	movw	r26, r22
     e1a:	01 c0       	rjmp	.+2      	; 0xe1e <malloc+0x62>
     e1c:	ef 01       	movw	r28, r30
	 * still fit the request -- we need it for step 2.
	 *
	 */
	for (s = 0, fp1 = __flp, fp2 = 0;
	     fp1;
	     fp2 = fp1, fp1 = fp1->nx) {
     e1e:	9a 01       	movw	r18, r20
     e20:	bd 01       	movw	r22, r26
     e22:	df 01       	movw	r26, r30
     e24:	02 80       	ldd	r0, Z+2	; 0x02
     e26:	f3 81       	ldd	r31, Z+3	; 0x03
     e28:	e0 2d       	mov	r30, r0
     e2a:	d7 cf       	rjmp	.-82     	; 0xdda <malloc+0x1e>
	 * difference between the requested size and the size of the
	 * chunk found is large enough for another freelist entry; if
	 * not, just enlarge the request size to what we have found,
	 * and use the entire chunk.
	 */
	if (s) {
     e2c:	21 15       	cp	r18, r1
     e2e:	31 05       	cpc	r19, r1
     e30:	f9 f0       	breq	.+62     	; 0xe70 <malloc+0xb4>
		if (s - len < sizeof(struct __freelist)) {
     e32:	28 1b       	sub	r18, r24
     e34:	39 0b       	sbc	r19, r25
     e36:	24 30       	cpi	r18, 0x04	; 4
     e38:	31 05       	cpc	r19, r1
     e3a:	80 f4       	brcc	.+32     	; 0xe5c <malloc+0xa0>
     e3c:	8a 81       	ldd	r24, Y+2	; 0x02
     e3e:	9b 81       	ldd	r25, Y+3	; 0x03
			/* Disconnect it from freelist and return it. */
			if (sfp2)
     e40:	61 15       	cp	r22, r1
     e42:	71 05       	cpc	r23, r1
     e44:	21 f0       	breq	.+8      	; 0xe4e <malloc+0x92>
				sfp2->nx = sfp1->nx;
     e46:	fb 01       	movw	r30, r22
     e48:	93 83       	std	Z+3, r25	; 0x03
     e4a:	82 83       	std	Z+2, r24	; 0x02
     e4c:	04 c0       	rjmp	.+8      	; 0xe56 <malloc+0x9a>
			else
				__flp = sfp1->nx;
     e4e:	90 93 42 02 	sts	0x0242, r25
     e52:	80 93 41 02 	sts	0x0241, r24
			return &(sfp1->nx);
     e56:	fe 01       	movw	r30, r28
     e58:	32 96       	adiw	r30, 0x02	; 2
     e5a:	44 c0       	rjmp	.+136    	; 0xee4 <malloc+0x128>
		 */
		cp = (char *)sfp1;
		s -= len;
		cp += s;
		sfp2 = (struct __freelist *)cp;
		sfp2->sz = len;
     e5c:	fe 01       	movw	r30, r28
     e5e:	e2 0f       	add	r30, r18
     e60:	f3 1f       	adc	r31, r19
     e62:	81 93       	st	Z+, r24
     e64:	91 93       	st	Z+, r25
		sfp1->sz = s - sizeof(size_t);
     e66:	22 50       	subi	r18, 0x02	; 2
     e68:	31 09       	sbc	r19, r1
     e6a:	39 83       	std	Y+1, r19	; 0x01
     e6c:	28 83       	st	Y, r18
		return &(sfp2->nx);
     e6e:	3a c0       	rjmp	.+116    	; 0xee4 <malloc+0x128>
	 * Under Unix, the "break value" was the end of the data
	 * segment as dynamically requested from the operating system.
	 * Since we don't have an operating system, just make sure
	 * that we don't collide with the stack.
	 */
	if (__brkval == 0)
     e70:	20 91 3f 02 	lds	r18, 0x023F
     e74:	30 91 40 02 	lds	r19, 0x0240
     e78:	23 2b       	or	r18, r19
     e7a:	41 f4       	brne	.+16     	; 0xe8c <malloc+0xd0>
		__brkval = __malloc_heap_start;
     e7c:	20 91 02 01 	lds	r18, 0x0102
     e80:	30 91 03 01 	lds	r19, 0x0103
     e84:	30 93 40 02 	sts	0x0240, r19
     e88:	20 93 3f 02 	sts	0x023F, r18
	cp = __malloc_heap_end;
     e8c:	20 91 00 01 	lds	r18, 0x0100
     e90:	30 91 01 01 	lds	r19, 0x0101
	if (cp == 0)
     e94:	21 15       	cp	r18, r1
     e96:	31 05       	cpc	r19, r1
     e98:	41 f4       	brne	.+16     	; 0xeaa <malloc+0xee>
		cp = STACK_POINTER() - __malloc_margin;
     e9a:	2d b7       	in	r18, 0x3d	; 61
     e9c:	3e b7       	in	r19, 0x3e	; 62
     e9e:	40 91 04 01 	lds	r20, 0x0104
     ea2:	50 91 05 01 	lds	r21, 0x0105
     ea6:	24 1b       	sub	r18, r20
     ea8:	35 0b       	sbc	r19, r21
	if (cp <= __brkval)
     eaa:	e0 91 3f 02 	lds	r30, 0x023F
     eae:	f0 91 40 02 	lds	r31, 0x0240
     eb2:	e2 17       	cp	r30, r18
     eb4:	f3 07       	cpc	r31, r19
     eb6:	a0 f4       	brcc	.+40     	; 0xee0 <malloc+0x124>
	  /*
	   * Memory exhausted.
	   */
	  return 0;
	avail = cp - __brkval;
     eb8:	2e 1b       	sub	r18, r30
     eba:	3f 0b       	sbc	r19, r31
	/*
	 * Both tests below are needed to catch the case len >= 0xfffe.
	 */
	if (avail >= len && avail >= len + sizeof(size_t)) {
     ebc:	28 17       	cp	r18, r24
     ebe:	39 07       	cpc	r19, r25
     ec0:	78 f0       	brcs	.+30     	; 0xee0 <malloc+0x124>
     ec2:	ac 01       	movw	r20, r24
     ec4:	4e 5f       	subi	r20, 0xFE	; 254
     ec6:	5f 4f       	sbci	r21, 0xFF	; 255
     ec8:	24 17       	cp	r18, r20
     eca:	35 07       	cpc	r19, r21
     ecc:	48 f0       	brcs	.+18     	; 0xee0 <malloc+0x124>
		fp1 = (struct __freelist *)__brkval;
		__brkval += len + sizeof(size_t);
     ece:	4e 0f       	add	r20, r30
     ed0:	5f 1f       	adc	r21, r31
     ed2:	50 93 40 02 	sts	0x0240, r21
     ed6:	40 93 3f 02 	sts	0x023F, r20
		fp1->sz = len;
     eda:	81 93       	st	Z+, r24
     edc:	91 93       	st	Z+, r25
		return &(fp1->nx);
     ede:	02 c0       	rjmp	.+4      	; 0xee4 <malloc+0x128>
		cp = STACK_POINTER() - __malloc_margin;
	if (cp <= __brkval)
	  /*
	   * Memory exhausted.
	   */
	  return 0;
     ee0:	e0 e0       	ldi	r30, 0x00	; 0
     ee2:	f0 e0       	ldi	r31, 0x00	; 0
	}
	/*
	 * Step 4: There's no help, just fail. :-/
	 */
	return 0;
}
     ee4:	cf 01       	movw	r24, r30
     ee6:	df 91       	pop	r29
     ee8:	cf 91       	pop	r28
     eea:	08 95       	ret

00000eec <free>:


ATTRIBUTE_CLIB_SECTION
void
free(void *p)
{
     eec:	cf 93       	push	r28
     eee:	df 93       	push	r29
	struct __freelist *fp1, *fp2, *fpnew;
	char *cp1, *cp2, *cpnew;

	/* ISO C says free(NULL) must be a no-op */
	if (p == 0)
     ef0:	00 97       	sbiw	r24, 0x00	; 0
     ef2:	09 f4       	brne	.+2      	; 0xef6 <free+0xa>
     ef4:	87 c0       	rjmp	.+270    	; 0x1004 <free+0x118>
		return;

	cpnew = p;
	cpnew -= sizeof(size_t);
     ef6:	fc 01       	movw	r30, r24
     ef8:	32 97       	sbiw	r30, 0x02	; 2
	fpnew = (struct __freelist *)cpnew;
	fpnew->nx = 0;
     efa:	13 82       	std	Z+3, r1	; 0x03
     efc:	12 82       	std	Z+2, r1	; 0x02
	/*
	 * Trivial case first: if there's no freelist yet, our entry
	 * will be the only one on it.  If this is the last entry, we
	 * can reduce __brkval instead.
	 */
	if (__flp == 0) {
     efe:	c0 91 41 02 	lds	r28, 0x0241
     f02:	d0 91 42 02 	lds	r29, 0x0242
     f06:	20 97       	sbiw	r28, 0x00	; 0
     f08:	81 f4       	brne	.+32     	; 0xf2a <free+0x3e>
		if ((char *)p + fpnew->sz == __brkval)
     f0a:	20 81       	ld	r18, Z
     f0c:	31 81       	ldd	r19, Z+1	; 0x01
     f0e:	28 0f       	add	r18, r24
     f10:	39 1f       	adc	r19, r25
     f12:	80 91 3f 02 	lds	r24, 0x023F
     f16:	90 91 40 02 	lds	r25, 0x0240
     f1a:	82 17       	cp	r24, r18
     f1c:	93 07       	cpc	r25, r19
     f1e:	79 f5       	brne	.+94     	; 0xf7e <free+0x92>
			__brkval = cpnew;
     f20:	f0 93 40 02 	sts	0x0240, r31
     f24:	e0 93 3f 02 	sts	0x023F, r30
     f28:	6d c0       	rjmp	.+218    	; 0x1004 <free+0x118>
	/*
	 * Trivial case first: if there's no freelist yet, our entry
	 * will be the only one on it.  If this is the last entry, we
	 * can reduce __brkval instead.
	 */
	if (__flp == 0) {
     f2a:	de 01       	movw	r26, r28
     f2c:	20 e0       	ldi	r18, 0x00	; 0
     f2e:	30 e0       	ldi	r19, 0x00	; 0
	 * if possible.
	 */
	for (fp1 = __flp, fp2 = 0;
	     fp1;
	     fp2 = fp1, fp1 = fp1->nx) {
		if (fp1 < fpnew)
     f30:	ae 17       	cp	r26, r30
     f32:	bf 07       	cpc	r27, r31
     f34:	50 f4       	brcc	.+20     	; 0xf4a <free+0x5e>
	 * freelist.  Try to aggregate the chunk with adjacent chunks
	 * if possible.
	 */
	for (fp1 = __flp, fp2 = 0;
	     fp1;
	     fp2 = fp1, fp1 = fp1->nx) {
     f36:	12 96       	adiw	r26, 0x02	; 2
     f38:	4d 91       	ld	r20, X+
     f3a:	5c 91       	ld	r21, X
     f3c:	13 97       	sbiw	r26, 0x03	; 3
	/*
	 * Now, find the position where our new entry belongs onto the
	 * freelist.  Try to aggregate the chunk with adjacent chunks
	 * if possible.
	 */
	for (fp1 = __flp, fp2 = 0;
     f3e:	9d 01       	movw	r18, r26
     f40:	41 15       	cp	r20, r1
     f42:	51 05       	cpc	r21, r1
     f44:	09 f1       	breq	.+66     	; 0xf88 <free+0x9c>
	     fp1;
	     fp2 = fp1, fp1 = fp1->nx) {
     f46:	da 01       	movw	r26, r20
     f48:	f3 cf       	rjmp	.-26     	; 0xf30 <free+0x44>
		if (fp1 < fpnew)
			continue;
		cp1 = (char *)fp1;
		fpnew->nx = fp1;
     f4a:	b3 83       	std	Z+3, r27	; 0x03
     f4c:	a2 83       	std	Z+2, r26	; 0x02
		if ((char *)&(fpnew->nx) + fpnew->sz == cp1) {
     f4e:	40 81       	ld	r20, Z
     f50:	51 81       	ldd	r21, Z+1	; 0x01
     f52:	84 0f       	add	r24, r20
     f54:	95 1f       	adc	r25, r21
     f56:	8a 17       	cp	r24, r26
     f58:	9b 07       	cpc	r25, r27
     f5a:	71 f4       	brne	.+28     	; 0xf78 <free+0x8c>
			/* upper chunk adjacent, assimilate it */
			fpnew->sz += fp1->sz + sizeof(size_t);
     f5c:	8d 91       	ld	r24, X+
     f5e:	9c 91       	ld	r25, X
     f60:	11 97       	sbiw	r26, 0x01	; 1
     f62:	84 0f       	add	r24, r20
     f64:	95 1f       	adc	r25, r21
     f66:	02 96       	adiw	r24, 0x02	; 2
     f68:	91 83       	std	Z+1, r25	; 0x01
     f6a:	80 83       	st	Z, r24
			fpnew->nx = fp1->nx;
     f6c:	12 96       	adiw	r26, 0x02	; 2
     f6e:	8d 91       	ld	r24, X+
     f70:	9c 91       	ld	r25, X
     f72:	13 97       	sbiw	r26, 0x03	; 3
     f74:	93 83       	std	Z+3, r25	; 0x03
     f76:	82 83       	std	Z+2, r24	; 0x02
		}
		if (fp2 == 0) {
     f78:	21 15       	cp	r18, r1
     f7a:	31 05       	cpc	r19, r1
     f7c:	29 f4       	brne	.+10     	; 0xf88 <free+0x9c>
			/* new head of freelist */
			__flp = fpnew;
     f7e:	f0 93 42 02 	sts	0x0242, r31
     f82:	e0 93 41 02 	sts	0x0241, r30
			return;
     f86:	3e c0       	rjmp	.+124    	; 0x1004 <free+0x118>
	 * Note that we get here either if we hit the "break" above,
	 * or if we fell off the end of the loop.  The latter means
	 * we've got a new topmost chunk.  Either way, try aggregating
	 * with the lower chunk if possible.
	 */
	fp2->nx = fpnew;
     f88:	d9 01       	movw	r26, r18
     f8a:	13 96       	adiw	r26, 0x03	; 3
     f8c:	fc 93       	st	X, r31
     f8e:	ee 93       	st	-X, r30
     f90:	12 97       	sbiw	r26, 0x02	; 2
	cp2 = (char *)&(fp2->nx);
	if (cp2 + fp2->sz == cpnew) {
     f92:	4d 91       	ld	r20, X+
     f94:	5d 91       	ld	r21, X+
     f96:	a4 0f       	add	r26, r20
     f98:	b5 1f       	adc	r27, r21
     f9a:	ea 17       	cp	r30, r26
     f9c:	fb 07       	cpc	r31, r27
     f9e:	79 f4       	brne	.+30     	; 0xfbe <free+0xd2>
		/* lower junk adjacent, merge */
		fp2->sz += fpnew->sz + sizeof(size_t);
     fa0:	80 81       	ld	r24, Z
     fa2:	91 81       	ldd	r25, Z+1	; 0x01
     fa4:	84 0f       	add	r24, r20
     fa6:	95 1f       	adc	r25, r21
     fa8:	02 96       	adiw	r24, 0x02	; 2
     faa:	d9 01       	movw	r26, r18
     fac:	11 96       	adiw	r26, 0x01	; 1
     fae:	9c 93       	st	X, r25
     fb0:	8e 93       	st	-X, r24
		fp2->nx = fpnew->nx;
     fb2:	82 81       	ldd	r24, Z+2	; 0x02
     fb4:	93 81       	ldd	r25, Z+3	; 0x03
     fb6:	13 96       	adiw	r26, 0x03	; 3
     fb8:	9c 93       	st	X, r25
     fba:	8e 93       	st	-X, r24
     fbc:	12 97       	sbiw	r26, 0x02	; 2
	}
	/*
	 * If there's a new topmost chunk, lower __brkval instead.
	 */
	for (fp1 = __flp, fp2 = 0;
     fbe:	e0 e0       	ldi	r30, 0x00	; 0
     fc0:	f0 e0       	ldi	r31, 0x00	; 0
	     fp1->nx != 0;
     fc2:	8a 81       	ldd	r24, Y+2	; 0x02
     fc4:	9b 81       	ldd	r25, Y+3	; 0x03
		fp2->nx = fpnew->nx;
	}
	/*
	 * If there's a new topmost chunk, lower __brkval instead.
	 */
	for (fp1 = __flp, fp2 = 0;
     fc6:	00 97       	sbiw	r24, 0x00	; 0
     fc8:	19 f0       	breq	.+6      	; 0xfd0 <free+0xe4>
	     fp1->nx != 0;
	     fp2 = fp1, fp1 = fp1->nx)
     fca:	fe 01       	movw	r30, r28
     fcc:	ec 01       	movw	r28, r24
     fce:	f9 cf       	rjmp	.-14     	; 0xfc2 <free+0xd6>
		/* advance to entry just before end of list */;
	cp2 = (char *)&(fp1->nx);
     fd0:	ce 01       	movw	r24, r28
     fd2:	02 96       	adiw	r24, 0x02	; 2
	if (cp2 + fp1->sz == __brkval) {
     fd4:	28 81       	ld	r18, Y
     fd6:	39 81       	ldd	r19, Y+1	; 0x01
     fd8:	82 0f       	add	r24, r18
     fda:	93 1f       	adc	r25, r19
     fdc:	20 91 3f 02 	lds	r18, 0x023F
     fe0:	30 91 40 02 	lds	r19, 0x0240
     fe4:	28 17       	cp	r18, r24
     fe6:	39 07       	cpc	r19, r25
     fe8:	69 f4       	brne	.+26     	; 0x1004 <free+0x118>
		if (fp2 == NULL)
     fea:	30 97       	sbiw	r30, 0x00	; 0
     fec:	29 f4       	brne	.+10     	; 0xff8 <free+0x10c>
			/* Freelist is empty now. */
			__flp = NULL;
     fee:	10 92 42 02 	sts	0x0242, r1
     ff2:	10 92 41 02 	sts	0x0241, r1
     ff6:	02 c0       	rjmp	.+4      	; 0xffc <free+0x110>
		else
			fp2->nx = NULL;
     ff8:	13 82       	std	Z+3, r1	; 0x03
     ffa:	12 82       	std	Z+2, r1	; 0x02
		__brkval = cp2 - sizeof(size_t);
     ffc:	d0 93 40 02 	sts	0x0240, r29
    1000:	c0 93 3f 02 	sts	0x023F, r28
	}
}
    1004:	df 91       	pop	r29
    1006:	cf 91       	pop	r28
    1008:	08 95       	ret

0000100a <__udivmodsi4>:
    100a:	a1 e2       	ldi	r26, 0x21	; 33
    100c:	1a 2e       	mov	r1, r26
    100e:	aa 1b       	sub	r26, r26
    1010:	bb 1b       	sub	r27, r27
    1012:	fd 01       	movw	r30, r26
    1014:	0d c0       	rjmp	.+26     	; 0x1030 <__udivmodsi4_ep>

00001016 <__udivmodsi4_loop>:
    1016:	aa 1f       	adc	r26, r26
    1018:	bb 1f       	adc	r27, r27
    101a:	ee 1f       	adc	r30, r30
    101c:	ff 1f       	adc	r31, r31
    101e:	a2 17       	cp	r26, r18
    1020:	b3 07       	cpc	r27, r19
    1022:	e4 07       	cpc	r30, r20
    1024:	f5 07       	cpc	r31, r21
    1026:	20 f0       	brcs	.+8      	; 0x1030 <__udivmodsi4_ep>
    1028:	a2 1b       	sub	r26, r18
    102a:	b3 0b       	sbc	r27, r19
    102c:	e4 0b       	sbc	r30, r20
    102e:	f5 0b       	sbc	r31, r21

00001030 <__udivmodsi4_ep>:
    1030:	66 1f       	adc	r22, r22
    1032:	77 1f       	adc	r23, r23
    1034:	88 1f       	adc	r24, r24
    1036:	99 1f       	adc	r25, r25
    1038:	1a 94       	dec	r1
    103a:	69 f7       	brne	.-38     	; 0x1016 <__udivmodsi4_loop>
    103c:	60 95       	com	r22
    103e:	70 95       	com	r23
    1040:	80 95       	com	r24
    1042:	90 95       	com	r25
    1044:	9b 01       	movw	r18, r22
    1046:	ac 01       	movw	r20, r24
    1048:	bd 01       	movw	r22, r26
    104a:	cf 01       	movw	r24, r30
    104c:	08 95       	ret

0000104e <__tablejump2__>:
    104e:	ee 0f       	add	r30, r30
    1050:	ff 1f       	adc	r31, r31

00001052 <__tablejump__>:
    1052:	05 90       	lpm	r0, Z+
    1054:	f4 91       	lpm	r31, Z
    1056:	e0 2d       	mov	r30, r0
    1058:	09 94       	ijmp

0000105a <_exit>:
    105a:	f8 94       	cli

0000105c <__stop_program>:
    105c:	ff cf       	rjmp	.-2      	; 0x105c <__stop_program>
