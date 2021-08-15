const Channels = require('../schemas/Channels');
const cachegoose = require('cachegoose');

async function getChannelInfo(channelId) {
    const info = Channels.findOne({ channelId }).cache(120, channelId).exec((err, records) => {
        if (err) console.error(err);
        return records;
    });
    return info;
}

//Would've spread with { ... } but then you would have to supply every variable every time, but this way you don't have to.
/**
 *
 * @param {{ channelId, goal, increment, count }} create 
 *
 */
async function createChannel(create) {
    return await Channels.create(create);
}

//Would've spread with { ... } but then you would have to supply every variable every time, but this way you don't have to.
/**
 * @param {any} channelId The id of the channel to update the document for.
 * @param {{ channelId: any, goal: Number, increment: Number, count: Number }} update 
 *
 */
async function updateChannel(channelId, update) {
    cachegoose.clearCache(channelId);
    return await Channels.updateOne({ channelId }, update);
}

async function deleteChannel(channelId) {
    cachegoose.clearCache(channelId);
    return await Channels.deleteOne({ channelId });
}

module.exports = {
    getChannelInfo,
    createChannel,
    updateChannel,
    deleteChannel,
};