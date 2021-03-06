const { Schema, model } = require('mongoose');

const channelSchema = new Schema({
    channelId: String,
    increment: {
        type: Number,
        default: 1,
    },
    goal: {
        type: Number,
        default: 100,
    },
    count: {
        type: Number,
        default: 0,
    },
});

module.exports = model('Channels', channelSchema);