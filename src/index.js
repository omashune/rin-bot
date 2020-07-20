const { token, pollingGroupId } = require('../config.json');

const { VK } = require('vk-io');
const { CommandHandler } = require('./structures');

const vk = new VK({ token, pollingGroupId, apiMode: 'parallel' });
const commandHandler = new CommandHandler(vk);

commandHandler.load();

vk.updates.startPolling()
    .then(() => console.log('[!] Bot started!'))
    .catch(err => console.log(`\x1b[31m${err.message}\x1b[0m`));