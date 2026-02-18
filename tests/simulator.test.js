'use strict';

const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { place, move, left, right, report, reset, run } = require('../src/Simulator');

beforeEach(reset);

describe('examples from the spec', () => {
  test('1:usecase', () => assert.equal(run('PLACE 0,0,NORTH,WHITE\nMOVE 1\nREPORT')[0], '0,1,NORTH,WHITE'));
  test('2:usecase', () => assert.equal(run('PLACE 0,0,NORTH,BLACK\nLEFT\nREPORT')[0], '0,0,WEST,BLACK'));
  test('3:usecase', () => assert.equal(run('PLACE 1,2,EAST,BLACK\nMOVE 2\nMOVE 1\nLEFT\nMOVE\nREPORT')[0], '4,3,NORTH,BLACK'));
});

describe('place', () => {
  test('puts pawn on board',   () => { place(3, 4, 'EAST', 'WHITE'); assert.equal(report(), '3,4,EAST,WHITE'); });
  test('ignores off-board',    () => { place(8, 0, 'NORTH', 'WHITE'); assert.equal(report(), null); });
  test('replaces existing',    () => { place(0, 0, 'NORTH', 'WHITE'); place(7, 7, 'SOUTH', 'BLACK'); assert.equal(report(), '7,7,SOUTH,BLACK'); });
  test('resets firstMove',     () => { place(0, 0, 'NORTH', 'WHITE'); move(1); place(3, 3, 'EAST', 'BLACK'); move(2); assert.equal(report(), '5,3,EAST,BLACK'); });
});

describe('move', () => {
  test('1 step',                 () => { place(0, 0, 'NORTH', 'WHITE'); move(1); assert.equal(report(), '0,1,NORTH,WHITE'); });
  test('2 steps on first move',  () => { place(0, 0, 'NORTH', 'WHITE'); move(2); assert.equal(report(), '0,2,NORTH,WHITE'); });
  test('3 steps rejected',       () => { place(0, 0, 'NORTH', 'WHITE'); move(3); assert.equal(report(), '0,0,NORTH,WHITE'); });
  test('2 steps after first rejected', () => { place(0, 0, 'NORTH', 'WHITE'); move(1); move(2); assert.equal(report(), '0,1,NORTH,WHITE'); });
  test('stops at north wall',    () => { place(0, 7, 'NORTH', 'WHITE'); move(1); assert.equal(report(), '0,7,NORTH,WHITE'); });
  test('stops at south wall',    () => { place(0, 0, 'SOUTH', 'WHITE'); move(1); assert.equal(report(), '0,0,SOUTH,WHITE'); });
  test('stops at east wall',     () => { place(7, 0, 'EAST',  'WHITE'); move(1); assert.equal(report(), '7,0,EAST,WHITE'); });
  test('stops at west wall',     () => { place(0, 0, 'WEST',  'WHITE'); move(1); assert.equal(report(), '0,0,WEST,WHITE'); });
  test('2-step blocked at edge', () => { place(0, 6, 'NORTH', 'WHITE'); move(2); assert.equal(report(), '0,6,NORTH,WHITE'); });
});

describe('turn', () => {
  const cases = [
    ['NORTH', left,  'WEST'],  ['WEST',  left,  'SOUTH'],
    ['SOUTH', left,  'EAST'],  ['EAST',  left,  'NORTH'],
    ['NORTH', right, 'EAST'],  ['EAST',  right, 'SOUTH'],
    ['SOUTH', right, 'WEST'],  ['WEST',  right, 'NORTH'],
  ];

  for (const [from, fn, expected] of cases) {
    test(`${from} → ${expected}`, () => {
      place(4, 4, from, 'WHITE');
      fn();
      assert.equal(report(), `4,4,${expected},WHITE`);
    });
  }
});

describe('report', () => {
  test('null before place',    () => assert.equal(report(), null));
  test('ignores pre-place cmds', () => assert.equal(run('MOVE 1\nLEFT\nREPORT\nPLACE 0,0,NORTH,WHITE\nREPORT')[0], '0,0,NORTH,WHITE'));
});