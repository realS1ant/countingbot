const Channels = require('../schemas/Channels');
const mongoose = require('mongoose');
const { Collection } = require('discord.js');

let channels = new Collection(); //<IDs, {increment, goal}}>

/**
 * @param {string} channelId ID of the channel to find info for
 * 
 * @returns {[string, number, number]} triple of count channel id, counting increment, and final goal, or null
 */
async function getChannelInfo(channelId) {
    if (channels.has(channelId)) return channels.get(channelId);
    const doc = await Channels.findOne({ channelId });
    if (doc) {
        channels.set(channelId, { increment: doc.increment, goal: doc.goal });
        return { increment: doc.increment, goal: doc.goal };
    }
    return null;
}

async function createChannel({ channelId, goal, increment }) {
    channels.set(channelId, { goal, increment });
    return await Channels.create({
        channelId, increment, goal
    });
}

module.exports = {
    getChannelInfo,
    createChannel
};