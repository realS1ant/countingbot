const djs = require('discord.js');
const { getChannelInfo, createChannel, updateChannel } = require('../utils');

/**
 * 
 * @param {djs.Client} client 
 * @param {djs.Message} message 
 */
async function execute(client, message) {
    if (message.author.id == client.user.id) return;

    const cleanContent = message.cleanContent.trim().replace(' ', '');
    const numbersOnly = /^[0-9]+$/g.test(cleanContent);
    const info = await getChannelInfo(message.channelId);

    if (!info) return;
    if (!numbersOnly) {
        message.delete();
        // message.channel.send(`:x: Hey, <@${message.author.id}>! Counting only, don't mess this up for everyone else!`).then(msg => setTimeout(() => msg.delete(), 3500)); No need for this...
        return;
    }

    let number;
    try {
        number = Number.parseInt(cleanContent);
    } catch (err) {
        message.delete();
        //This should never happen because we varified it was all numbers above, and we also replace whitespace.
        message.channel.send(`:x: Hey, <@${message.author.id}>, something went wrong with that number.`).then(msg => setTimeout(() => msg.delete(), 3500));
        return;
    }

    if (info.count + info.increment != number) {
        // message.reply(`:x: Uh oh! <@${message.author.id}> messed up and now we have to start over!`);
        message.delete();
        return;
    }

    if (number >= info.goal) {
        await winner(message);
        return;
    }

    //Clean Count
    updateChannel(message.channelId, { count: number });
}

/**
 * 
 * @param {djs.Message} message 
 */
async function winner(message) {
    //We must delete the channel because bots can't delete channels w/ over 100 messages.
    message.reply(':white_check_mark: Congratulations the goal was beaten!');

    const newChannel = await message.channel.clone();
    const { increment, goal } = await getChannelInfo(message.channelId);
    /* 
    We have to pull only these two values for two reasons, 
      1) they're the only ones we need. 
      2) having the _id and such when creating a record with mongoose makes many errors.
    */
    const info = {
        channelId: newChannel.id,
        count: 0,
        increment,
        goal,
    };

    await message.channel.delete(); //If we just delete it here then it'll get deleted by the channelDelete listener (./channelDelete.js), so we can just make a new one.
    await createChannel(info);
    await newChannel.send(`Congratulations, the goal was beaten! Now try and count to ${info.goal} ${info.increment != 1 ? 'by ' + info.increment + 's ' : ''}again!`);
    await newChannel.lastMessage.pin().then(() => {
        newChannel.lastMessage.delete(); //Delete discord's ugly pin message.
    });
    await newChannel.send('0'); //Give them a starting point.
}

module.exports = {
    event: 'messageCreate',
    execute
}