#! /usr/bin/env node

const { search } = require('..');
const tocsv = x => x.map(y => `${y.url}\t${y.text}`).join('\n');
(async () => {
  const term = process.argv.slice(2).join('+');
  const result = await search(term)
  console.log(tocsv(result));
})();
