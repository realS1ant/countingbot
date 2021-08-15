const { Client, Channel } = require('discord.js');
const { getChannelInfo, deleteChannel } = require('../utils');

/**
 * 
 * @param {Client} client 
 * @param {Channel} channel 
 */
async function execute(client, channel) {
    if (await getChannelInfo(channel.id)) {
        deleteChannel(channel.id);
    }
}

module.exports = {
    event: 'channelDelete',
    execute
}