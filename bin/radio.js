#! /usr/bin/env node

const { search } = require('..');
const debounce = require('debounce');
const fuzzy = require('fuzzy');
const inquirer = require('inquirer');

const searchterm = async () => {
  const arg = process.argv.slice(2).join('+');
  if (arg) {
    return arg;
  }

  const { term } = await inquirer.prompt({
    type: 'input',
    name: 'term',
    message: 'What do you want to listen?'
  });
  return term;
};

(async () => {
  try {
    const term = await searchterm();
    console.log('Looking for ...', term);
    const results = await search(term);
    const { selection } = await inquirer.prompt({
      type: 'list',
      name: 'selection',
      message: 'Select a channel',
      pageSize: 32,
      choices: results.map(x => ({
        name: x.text,
        value: x.url
      }))
    });
    console.log(selection);
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(-1);
  }
})();
