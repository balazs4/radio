#! /usr/bin/env node

const { search } = require('..');
const debounce = require('debounce');
const fuzzy = require('fuzzy');
const inquirer = require('inquirer');
inquirer.registerPrompt(
  'autocomplete',
  require('inquirer-autocomplete-prompt')
);
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
const lookup = channels => (_, input) =>
  new Promise(resolve => {
    resolve(
      fuzzy
        .filter(input === null ? '' : input, channels, {
          extract: x => x.text
        })
        .map(x => ({
          name: x.original.text,
          value: x.original.url
        }))
    );
  });

(async () => {
  try {
    const term = await searchterm();
    console.log('Looking for ...', term);
    const channels = await search(term);
    const { selection } = await inquirer.prompt({
      type: 'autocomplete',
      name: 'selection',
      message: 'Select a channel',
      source: lookup(channels),
      pageSize: 32
    });
    console.log(selection);
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(-1);
  }
})();
