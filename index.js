import fs from 'fs';
import path from 'path';
import { argv } from 'process';
// import { JSDOM } from 'jsdom';
import { parseRow, transformRow, validateRow } from './utils.js';

// Absolute necessity. ESM doens't have it.
const __dirname = path.dirname(new URL(import.meta.url).pathname);
// Takes a set of functions and returns a function that runs its argument
// through all previously specified functions.
const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((v, f) => f(v), x);

// Customizable filename...
let FILE_NAME = argv[2];
if (!FILE_NAME) {
  console.error('No filename specified!');
  process.exit(1);
}

// Where is my pipe operator?! I can't use my `pipe` function for these...
let columns = fs.readFileSync(path.join(__dirname, FILE_NAME)).toString();

// Tries to match for the weather station number followed by the date, which is
// always in the same format.
let match = /\d+,\d{4}\d{2}\d{2}/.exec(columns);
if (!match) {
  console.error('Something went horribly wrong in trying to find where the data starts...');
  process.exit(1);
}

// Preprocessing... trim off all text before the data, then trim the data, then
// replace all carriage returns with nothing, and finally split the data by
// newlines.
columns = columns.substring(match.index).trim().replace(/\r/g, '').split('\n');

// Now let's process all rows into nicely formatted data.
let result = [];
for (let row of columns) {
  row = row.split(',');
  for (let cell in row) row[cell] = row[cell].trim();
  let resultRow = pipe(parseRow, validateRow, transformRow)(row);
  result.push(resultRow);
}

// "Don't care too much about how it looks", they said.
console.table(result);

// Horrible idea I totally didn't have
// const dom = await JSDOM.fromFile(path.join(__dirname, 'index.html'));
// const { window } = dom;
// const { document } = window;
//
// let container = document.querySelector('.container');
//
// for (let row of result) {
//   let rowDiv = document.createElement('div');
//   rowDiv.className = 'rowContainer';
//
//   container.appendChild(rowDiv);
// }
//
// fs.writeFileSync(path.join(__dirname, 'result.html'), dom.serialize());
