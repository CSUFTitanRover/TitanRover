
/tmp/build5736274865649334927.tmp/Test.cpp.elf:     file format elf32-avr


Disassembly of section .text:

00000000 <__vectors>:
   0:	0c 94 34 00 	jmp	0x68	; 0x68 <__ctors_end>
   4:	0c 94 46 00 	jmp	0x8c	; 0x8c <__bad_interrupt>
   8:	0c 94 46 00 	jmp	0x8c	; 0x8c <__bad_interrupt>
   c:	0c 94 46 00 	jmp	0x8c	; 0x8c <__bad_interrupt>
  10:	0c 94 46 00 	jmp	0x8c	; 0x8c <__bad_interrupt>
  14:	0c 94 46 00 	jmp	0x8c	; 0x8c <__bad_interrupt>
  18:	0c 94 46 00 	jmp	0x8c	; 0x8c <__bad_interrupt>
  1c:	0c 94 46 00 	jmp	0x8c	; 0x8c <__bad_interrupt>
  20:	0c 94 46 00 	jmp	0x8c	; 0x8c <__bad_interrupt>
  24:	0c 94 46 00 	jmp	0x8c	; 0x8c <__bad_interrupt>
  28:	0c 94 46 00 	jmp	0x8c	; 0x8c <__bad_interrupt>
  2c:	0c 94 46 00 	jmp	0x8c	; 0x8c <__bad_interrupt>
  30:	0c 94 46 00 	jmp	0x8c	; 0x8c <__bad_interrupt>
  34:	0c 94 46 00 	jmp	0x8c	; 0x8c <__bad_interrupt>
  38:	0c 94 46 00 	jmp	0x8c	; 0x8c <__bad_interrupt>
  3c:	0c 94 46 00 	jmp	0x8c	; 0x8c <__bad_interrupt>
  40:	0c 94 60 00 	jmp	0xc0	; 0xc0 <__vector_16>
  44:	0c 94 46 00 	jmp	0x8c	; 0x8c <__bad_interrupt>
  48:	0c 94 46 00 	jmp	0x8c	; 0x8c <__bad_interrupt>
  4c:	0c 94 46 00 	jmp	0x8c	; 0x8c <__bad_interrupt>
  50:	0c 94 46 00 	jmp	0x8c	; 0x8c <__bad_interrupt>
  54:	0c 94 46 00 	jmp	0x8c	; 0x8c <__bad_interrupt>
  58:	0c 94 46 00 	jmp	0x8c	; 0x8c <__bad_interrupt>
  5c:	0c 94 46 00 	jmp	0x8c	; 0x8c <__bad_interrupt>
  60:	0c 94 46 00 	jmp	0x8c	; 0x8c <__bad_interrupt>
  64:	0c 94 46 00 	jmp	0x8c	; 0x8c <__bad_interrupt>

00000068 <__ctors_end>:
  68:	11 24       	eor	r1, r1
  6a:	1f be       	out	0x3f, r1	; 63
  6c:	cf ef       	ldi	r28, 0xFF	; 255
  6e:	d8 e0       	ldi	r29, 0x08	; 8
  70:	de bf       	out	0x3e, r29	; 62
  72:	cd bf       	out	0x3d, r28	; 61

00000074 <__do_clear_bss>:
  74:	11 e0       	ldi	r17, 0x01	; 1
  76:	a0 e0       	ldi	r26, 0x00	; 0
  78:	b1 e0       	ldi	r27, 0x01	; 1
  7a:	01 c0       	rjmp	.+2      	; 0x7e <.do_clear_bss_start>

0000007c <.do_clear_bss_loop>:
  7c:	1d 92       	st	X+, r1

0000007e <.do_clear_bss_start>:
  7e:	aa 30       	cpi	r26, 0x0A	; 10
  80:	b1 07       	cpc	r27, r17
  82:	e1 f7       	brne	.-8      	; 0x7c <.do_clear_bss_loop>
  84:	0e 94 53 00 	call	0xa6	; 0xa6 <main>
  88:	0c 94 e5 00 	jmp	0x1ca	; 0x1ca <_exit>

0000008c <__bad_interrupt>:
  8c:	0c 94 00 00 	jmp	0	; 0x0 <__vectors>

00000090 <setup>:
  90:	80 91 00 01 	lds	r24, 0x0100
  94:	89 36       	cpi	r24, 0x69	; 105
  96:	29 f4       	brne	.+10     	; 0xa2 <setup+0x12>
  98:	80 91 00 01 	lds	r24, 0x0100
  9c:	8f 5f       	subi	r24, 0xFF	; 255
  9e:	80 93 00 01 	sts	0x0100, r24
  a2:	08 95       	ret

000000a4 <loop>:
  a4:	08 95       	ret

000000a6 <main>:
#include <Arduino.h>

int main(void)
{
	init();
  a6:	0e 94 aa 00 	call	0x154	; 0x154 <init>

#if defined(USBCON)
	USBDevice.attach();
#endif
	
	setup();
  aa:	0e 94 48 00 	call	0x90	; 0x90 <setup>
    
	for (;;) {
		loop();
		if (serialEventRun) serialEventRun();
  ae:	c0 e0       	ldi	r28, 0x00	; 0
  b0:	d0 e0       	ldi	r29, 0x00	; 0
#endif
	
	setup();
    
	for (;;) {
		loop();
  b2:	0e 94 52 00 	call	0xa4	; 0xa4 <loop>
		if (serialEventRun) serialEventRun();
  b6:	20 97       	sbiw	r28, 0x00	; 0
  b8:	e1 f3       	breq	.-8      	; 0xb2 <main+0xc>
  ba:	0e 94 00 00 	call	0	; 0x0 <__vectors>
  be:	f9 cf       	rjmp	.-14     	; 0xb2 <main+0xc>

000000c0 <__vector_16>:
#if defined(__AVR_ATtiny24__) || defined(__AVR_ATtiny44__) || defined(__AVR_ATtiny84__)
ISR(TIM0_OVF_vect)
#else
ISR(TIMER0_OVF_vect)
#endif
{
  c0:	1f 92       	push	r1
  c2:	0f 92       	push	r0
  c4:	0f b6       	in	r0, 0x3f	; 63
  c6:	0f 92       	push	r0
  c8:	11 24       	eor	r1, r1
  ca:	2f 93       	push	r18
  cc:	3f 93       	push	r19
  ce:	8f 93       	push	r24
  d0:	9f 93       	push	r25
  d2:	af 93       	push	r26
  d4:	bf 93       	push	r27
	// copy these to local variables so they can be stored in registers
	// (volatile variables must be read from memory on every access)
	unsigned long m = timer0_millis;
  d6:	80 91 02 01 	lds	r24, 0x0102
  da:	90 91 03 01 	lds	r25, 0x0103
  de:	a0 91 04 01 	lds	r26, 0x0104
  e2:	b0 91 05 01 	lds	r27, 0x0105
	unsigned char f = timer0_fract;
  e6:	30 91 01 01 	lds	r19, 0x0101

	m += MILLIS_INC;
	f += FRACT_INC;
  ea:	23 e0       	ldi	r18, 0x03	; 3
  ec:	23 0f       	add	r18, r19
	if (f >= FRACT_MAX) {
  ee:	2d 37       	cpi	r18, 0x7D	; 125
  f0:	20 f4       	brcc	.+8      	; 0xfa <__vector_16+0x3a>
	// copy these to local variables so they can be stored in registers
	// (volatile variables must be read from memory on every access)
	unsigned long m = timer0_millis;
	unsigned char f = timer0_fract;

	m += MILLIS_INC;
  f2:	01 96       	adiw	r24, 0x01	; 1
  f4:	a1 1d       	adc	r26, r1
  f6:	b1 1d       	adc	r27, r1
  f8:	05 c0       	rjmp	.+10     	; 0x104 <__vector_16+0x44>
	f += FRACT_INC;
	if (f >= FRACT_MAX) {
		f -= FRACT_MAX;
  fa:	26 e8       	ldi	r18, 0x86	; 134
  fc:	23 0f       	add	r18, r19
		m += 1;
  fe:	02 96       	adiw	r24, 0x02	; 2
 100:	a1 1d       	adc	r26, r1
 102:	b1 1d       	adc	r27, r1
	}

	timer0_fract = f;
 104:	20 93 01 01 	sts	0x0101, r18
	timer0_millis = m;
 108:	80 93 02 01 	sts	0x0102, r24
 10c:	90 93 03 01 	sts	0x0103, r25
 110:	a0 93 04 01 	sts	0x0104, r26
 114:	b0 93 05 01 	sts	0x0105, r27
	timer0_overflow_count++;
 118:	80 91 06 01 	lds	r24, 0x0106
 11c:	90 91 07 01 	lds	r25, 0x0107
 120:	a0 91 08 01 	lds	r26, 0x0108
 124:	b0 91 09 01 	lds	r27, 0x0109
 128:	01 96       	adiw	r24, 0x01	; 1
 12a:	a1 1d       	adc	r26, r1
 12c:	b1 1d       	adc	r27, r1
 12e:	80 93 06 01 	sts	0x0106, r24
 132:	90 93 07 01 	sts	0x0107, r25
 136:	a0 93 08 01 	sts	0x0108, r26
 13a:	b0 93 09 01 	sts	0x0109, r27
}
 13e:	bf 91       	pop	r27
 140:	af 91       	pop	r26
 142:	9f 91       	pop	r25
 144:	8f 91       	pop	r24
 146:	3f 91       	pop	r19
 148:	2f 91       	pop	r18
 14a:	0f 90       	pop	r0
 14c:	0f be       	out	0x3f, r0	; 63
 14e:	0f 90       	pop	r0
 150:	1f 90       	pop	r1
 152:	18 95       	reti

00000154 <init>:

void init()
{
	// this needs to be called before setup() or some functions won't
	// work there
	sei();
 154:	78 94       	sei
	
	// on the ATmega168, timer 0 is also used for fast hardware pwm
	// (using phase-correct PWM would mean that timer 0 overflowed half as often
	// resulting in different millis() behavior on the ATmega8 and ATmega168)
#if defined(TCCR0A) && defined(WGM01)
	sbi(TCCR0A, WGM01);
 156:	84 b5       	in	r24, 0x24	; 36
 158:	82 60       	ori	r24, 0x02	; 2
 15a:	84 bd       	out	0x24, r24	; 36
	sbi(TCCR0A, WGM00);
 15c:	84 b5       	in	r24, 0x24	; 36
 15e:	81 60       	ori	r24, 0x01	; 1
 160:	84 bd       	out	0x24, r24	; 36
	// this combination is for the standard atmega8
	sbi(TCCR0, CS01);
	sbi(TCCR0, CS00);
#elif defined(TCCR0B) && defined(CS01) && defined(CS00)
	// this combination is for the standard 168/328/1280/2560
	sbi(TCCR0B, CS01);
 162:	85 b5       	in	r24, 0x25	; 37
 164:	82 60       	ori	r24, 0x02	; 2
 166:	85 bd       	out	0x25, r24	; 37
	sbi(TCCR0B, CS00);
 168:	85 b5       	in	r24, 0x25	; 37
 16a:	81 60       	ori	r24, 0x01	; 1
 16c:	85 bd       	out	0x25, r24	; 37

	// enable timer 0 overflow interrupt
#if defined(TIMSK) && defined(TOIE0)
	sbi(TIMSK, TOIE0);
#elif defined(TIMSK0) && defined(TOIE0)
	sbi(TIMSK0, TOIE0);
 16e:	ee e6       	ldi	r30, 0x6E	; 110
 170:	f0 e0       	ldi	r31, 0x00	; 0
 172:	80 81       	ld	r24, Z
 174:	81 60       	ori	r24, 0x01	; 1
 176:	80 83       	st	Z, r24
	// this is better for motors as it ensures an even waveform
	// note, however, that fast pwm mode can achieve a frequency of up
	// 8 MHz (with a 16 MHz clock) at 50% duty cycle

#if defined(TCCR1B) && defined(CS11) && defined(CS10)
	TCCR1B = 0;
 178:	e1 e8       	ldi	r30, 0x81	; 129
 17a:	f0 e0       	ldi	r31, 0x00	; 0
 17c:	10 82       	st	Z, r1

	// set timer 1 prescale factor to 64
	sbi(TCCR1B, CS11);
 17e:	80 81       	ld	r24, Z
 180:	82 60       	ori	r24, 0x02	; 2
 182:	80 83       	st	Z, r24
#if F_CPU >= 8000000L
	sbi(TCCR1B, CS10);
 184:	80 81       	ld	r24, Z
 186:	81 60       	ori	r24, 0x01	; 1
 188:	80 83       	st	Z, r24
	sbi(TCCR1, CS10);
#endif
#endif
	// put timer 1 in 8-bit phase correct pwm mode
#if defined(TCCR1A) && defined(WGM10)
	sbi(TCCR1A, WGM10);
 18a:	e0 e8       	ldi	r30, 0x80	; 128
 18c:	f0 e0       	ldi	r31, 0x00	; 0
 18e:	80 81       	ld	r24, Z
 190:	81 60       	ori	r24, 0x01	; 1
 192:	80 83       	st	Z, r24

	// set timer 2 prescale factor to 64
#if defined(TCCR2) && defined(CS22)
	sbi(TCCR2, CS22);
#elif defined(TCCR2B) && defined(CS22)
	sbi(TCCR2B, CS22);
 194:	e1 eb       	ldi	r30, 0xB1	; 177
 196:	f0 e0       	ldi	r31, 0x00	; 0
 198:	80 81       	ld	r24, Z
 19a:	84 60       	ori	r24, 0x04	; 4
 19c:	80 83       	st	Z, r24

	// configure timer 2 for phase correct pwm (8-bit)
#if defined(TCCR2) && defined(WGM20)
	sbi(TCCR2, WGM20);
#elif defined(TCCR2A) && defined(WGM20)
	sbi(TCCR2A, WGM20);
 19e:	e0 eb       	ldi	r30, 0xB0	; 176
 1a0:	f0 e0       	ldi	r31, 0x00	; 0
 1a2:	80 81       	ld	r24, Z
 1a4:	81 60       	ori	r24, 0x01	; 1
 1a6:	80 83       	st	Z, r24
#if defined(ADCSRA)
	// set a2d prescale factor to 128
	// 16 MHz / 128 = 125 KHz, inside the desired 50-200 KHz range.
	// XXX: this will not work properly for other clock speeds, and
	// this code should use F_CPU to determine the prescale factor.
	sbi(ADCSRA, ADPS2);
 1a8:	ea e7       	ldi	r30, 0x7A	; 122
 1aa:	f0 e0       	ldi	r31, 0x00	; 0
 1ac:	80 81       	ld	r24, Z
 1ae:	84 60       	ori	r24, 0x04	; 4
 1b0:	80 83       	st	Z, r24
	sbi(ADCSRA, ADPS1);
 1b2:	80 81       	ld	r24, Z
 1b4:	82 60       	ori	r24, 0x02	; 2
 1b6:	80 83       	st	Z, r24
	sbi(ADCSRA, ADPS0);
 1b8:	80 81       	ld	r24, Z
 1ba:	81 60       	ori	r24, 0x01	; 1
 1bc:	80 83       	st	Z, r24

	// enable a2d conversions
	sbi(ADCSRA, ADEN);
 1be:	80 81       	ld	r24, Z
 1c0:	80 68       	ori	r24, 0x80	; 128
 1c2:	80 83       	st	Z, r24
	// here so they can be used as normal digital i/o; they will be
	// reconnected in Serial.begin()
#if defined(UCSRB)
	UCSRB = 0;
#elif defined(UCSR0B)
	UCSR0B = 0;
 1c4:	10 92 c1 00 	sts	0x00C1, r1
 1c8:	08 95       	ret

000001ca <_exit>:
 1ca:	f8 94       	cli

000001cc <__stop_program>:
 1cc:	ff cf       	rjmp	.-2      	; 0x1cc <__stop_program>
