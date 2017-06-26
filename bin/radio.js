#! /usr/bin/env node

const { search } = require('..');
const searchterm = process.argv.slice(2).join('+');

(async term => {
  const list = await search(term);
  console.log(list);
})();
