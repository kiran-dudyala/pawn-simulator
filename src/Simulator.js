'use strict';

const BOARD_SIZE = 8;

const VECTORS = {
  NORTH: [0,  1],
  SOUTH: [0, -1],
  EAST:  [1,  0],
  WEST:  [-1, 0],
};

const TURNS = ['NORTH', 'EAST', 'SOUTH', 'WEST'];

let pawn = null;

const onBoard = (x, y) => x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE;

function place(x, y, facing, colour) {
  if (!onBoard(x, y)) return;
  pawn = { x, y, facing, colour, firstMove: true };
}

function move(steps = 1) {
  if (!pawn) return;
  if (pawn.firstMove && steps > 2) return;
  if (!pawn.firstMove && steps !== 1) return;

  const [dx, dy] = VECTORS[pawn.facing];
  const nx = pawn.x + dx * steps;
  const ny = pawn.y + dy * steps;

  if (!onBoard(nx, ny)) return;

  pawn.x = nx;
  pawn.y = ny;
  pawn.firstMove = false;
}

function left() {
  if (!pawn) return;
  pawn.facing = TURNS[(TURNS.indexOf(pawn.facing) + 3) % 4];
}

function right() {
  if (!pawn) return;
  pawn.facing = TURNS[(TURNS.indexOf(pawn.facing) + 1) % 4];
}

function report() {
  if (!pawn) return null;
  return `${pawn.x},${pawn.y},${pawn.facing},${pawn.colour}`;
}

function reset() {
  pawn = null;
}

function run(input) {
  reset();
  const output = [];

  for (const raw of input.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;

    const [cmd, ...rest] = line.split(' ');

    switch (cmd.toUpperCase()) {
      case 'PLACE': {
        const [x, y, facing, colour] = rest.join(' ').split(',');
        place(Number(x), Number(y), facing.trim().toUpperCase(), colour.trim().toUpperCase());
        break;
      }
      case 'MOVE':
        move(rest[0] ? Number(rest[0]) : 1);
        break;
      case 'LEFT':
        left();
        break;
      case 'RIGHT':
        right();
        break;
      case 'REPORT': {
        const result = report();
        if (result) output.push(result);
        break;
      }
    }
  }

  return output;
}

module.exports = { place, move, left, right, report, reset, run };