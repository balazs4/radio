#! /usr/bin/env node
const log = require('debug')('radio');
const { search } = require('..');
const kifli = require('kifli');
const fuzzy = require('fuzzy');
const request = require('request-promise-native');
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
    message:
      'What do you want to listen? (type e.g. "Metalcore" or "Drum and bass")'
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
    log('Looking for ...', term);
    const channels = await search(term);
    const { selection } = await inquirer.prompt({
      type: 'autocomplete',
      name: 'selection',
      message: 'Select a channel',
      source: lookup(channels),
      pageSize: 32
    });
    log(selection);
    const channel = await request(selection);
    log(channel.trim());
    if (!process.env.BROKER) {
      console.log(channel.trim());
      process.exit(0);
    }
    const client = await kifli(process.env.BROKER || 'localhost', {
      clientId: 'radio-cli'
    });
    await client.publish('/jukebox/control', { command: 'stop' }, { qos: 2 });
    await client.publish(
      '/jukebox/control',
      {
        command: 'loadfile',
        args: [channel.trim()]
      },
      { qos: 2 }
    );
    await client.end();
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(-1);
  }
})();
