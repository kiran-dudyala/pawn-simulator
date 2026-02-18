'use strict';

const fs = require('fs');
const { run } = require('./Simulator');

const file = process.argv[2];
const input = file ? fs.readFileSync(file, 'utf8') : fs.readFileSync('/dev/stdin', 'utf8');

run(input).forEach(line => console.log(line));