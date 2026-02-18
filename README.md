# Pawn Simulator

A robot moves around an 8x8 grid of tiles. You give it commands. It won't walk off the edge.

```
ex: Bottom-left is `0,0`. Top-right is `7,7`.
```

## Usage

```
node src/index.js commands.txt
```

## Commands

Commands.txt (explanation)
------------------------------
 `PLACE X,Y,FACING,COLOUR` -> Drop the robot on tile X,Y facing a direction;
 `MOVE [steps]` -> Walk forward 1 step (or 2 on the very first move);
 `LEFT` -> Spin 90° to the left without moving;
 `RIGHT` -> Spin 90° to the right without moving;
 `REPORT` -> Print where the robot is right now;

`FACING` is one of: `NORTH` `SOUTH` `EAST` `WEST`

`COLOUR` is one of: `WHITE` `BLACK`

## Commands Example

```
PLACE 0,0,NORTH,WHITE    robot appears at bottom-left, facing up
MOVE 1                   walks 1 tile up
REPORT                   prints current position
```

Output:
```
0,1,NORTH,WHITE
```

## Rules

- The robot must be placed before any other command works.
- It cannot walk off the edge — that command is ignored and the next one still works.
- First move can be 1 or 2 steps. Every move after that is exactly 1 step.
- A new PLACE resets the robot completely.

## Tests

```
node --test tests/simulator.test.js
```