#! /usr/bin/env node

const readline = require('readline');
const opmltojson = require('opml-to-json');

const std = readline.createInterface({
  input: process.stdin,
});

const lines = [];
std.on('line', (line) => lines.push(line));
std.on('close', () => {
  const input = lines.join('\n');
  opmltojson(input, (err, parsed) => {
    if (err) throw err;
    console.log(JSON.stringify(parsed));
  });
});
