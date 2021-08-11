const djs = require('discord.js');
const fs = require('fs');
const { getChannelInfo } = require('../utils');
/**
 * 
 * @param {djs.Client} client 
 * @param {djs.Message} message 
 */
async function execute(client, message) {
    if (message.author.id == client.user.id) return;
    const numbersOnly = /^[0-9]+$/g.test(message.cleanContent.trim());
    const info = await getChannelInfo(message.channelId);
    if (!info) return;
    if (!numbersOnly) {
        message.delete();
        // message.channel.send(`:x: Hey, <@${message.author.id}>! Counting only, don't mess this up for everyone else!`).then(msg => setTimeout(() => msg.delete(), 3500)); No need for this...
        return;
    }
    const messages = await message.channel.messages.fetch({ limit: 3 });
    let lastMessage = [...messages.values()][1]; //Just to be extra safe we make sure to do this check here in case the bot has replied to a rule breaker and our message is not yet deleted.
    if (lastMessage.author.id == client.user.id && lastMessage.cleanContent != '0') lastMessage = [...messages.values()][2];

    // if (lastMessage.author.id == message.author.id) {
    //     message.delete();
    //     message.channel.send(`:x: Nope! Can't play twice in a row!`).then(msg => setTimeout(() => msg.delete(), 3500));
    //     return;
    // }

    //pretty old school way of doing things, but still very effective
    let lastNumber;
    try {
        lastNumber = Number.parseInt(lastMessage.cleanContent.trim());
    } catch (err) {
        //This should really never happen, but just in case! (It could posisbly also be editted/deleted??)
        message.delete();
        lastMessage.delete();
        message.channel.send(`:x: Uh oh, something went wrong.`).then(msg => setTimeout(() => msg.delete(), 3500));
        return;
    }

    let number;
    try {
        number = Number.parseInt(message.cleanContent.trim());
    } catch (err) {
        message.delete();
        message.channel.send(`:x: Hey, <@${message.author.id}>, something went wrong with that number.`).then(msg => setTimeout(() => msg.delete(), 3500));
        return;
    }

    if (lastNumber + info.increment != number) {
        // message.reply(`:x: Uh oh! <@${message.author.id}> messed up and now we have to start over!`);
        message.delete(); //No griefing!
        console.log(`${lastNumber} + ${info.increment} != ${number}`);
        return;
    }

    if (number >= info.goal) {
        await winner(client, message);
        return;
    }

    console.log('it was good ;)');
}

/**
 * 
 * @param {djs.Client} client 
 * @param {djs.Message} message 
 */
async function winner(client, message) {
    //We must delete the channel because bots can't delete over 100 messages.
    message.reply(':white_check_mark: Congrats, you guys beat the goal!');
}

module.exports = {
    event: 'messageCreate',
    execute
}