const { SlashCommandBuilder, SlashCommandStringOption, SlashCommandIntegerOption } = require('@discordjs/builders');
const { Interaction, Client, Permissions } = require('discord.js');
const { updateChannel, getChannelInfo } = require('../utils');
/**
 * 
 * @param {Client} client
 * @param {Interaction} interaction 
 */
async function execute(client, interaction) {
    if (!interaction.isCommand()) return;

    if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
        interaction.reply(':x: Sorry, this command is reserved for thos with the `MANAGE_CHANNELS` permission only!').then(() => {
            setTimeout(() => interaction.deleteReply(), 2500);
        });
        return;
    }

    const channel = interaction.channel;
    const info = await getChannelInfo(channel.id);

    if (!info) {
        interaction.reply(':x: Sorry, this command is only available inside a counting channel. Create one with /setup!').then(() => {
            setTimeout(() => interaction.deleteReply(), 2500);
        });
        return;
    }

    let name = interaction.options.getString('name', false);
    let goal = interaction.options.getInteger('goal', false);
    let increment = interaction.options.getInteger('increment', false);
    let count = interaction.options.getInteger('count', false);

    if (name) channel.setName(name);
    if (!goal) goal = info.goal;
    if (!increment) increment = info.increment;
    if (count) {
        interaction.channel.send(`Change of plans, we're now on ${count} counting to ${goal}${increment == 1 ? '.' : ' by ' + increment + 's.'}`);
    } else count = info.count;

    await updateChannel(channel.id, { channelId: channel.id, goal, increment, count });
    channel.setTopic(`Counting Channel | Goal: ${goal} by increments of ${increment}`, `Counting channel information changed via /update by ${interaction.member.user.username}#${interaction.member.user.discriminator}.`);

    interaction.reply(':white_check_mark: Updated!').then(() => {
        setTimeout(() => interaction.deleteReply(), 2500);
    });
}

module.exports = {
    data: new SlashCommandBuilder().setName('update').setDescription('Used to change details of your counting channels! (Channel Name, Goal, Increment, etc.)')
        .addStringOption(new SlashCommandStringOption().setRequired(false).setName('name').setDescription('New channel name.'))
        .addIntegerOption(new SlashCommandIntegerOption().setRequired(false).setName('goal').setDescription('New final goal.'))
        .addIntegerOption(new SlashCommandIntegerOption().setRequired(false).setName('count').setDescription('New current number to count from.'))
        .addIntegerOption(new SlashCommandIntegerOption().setRequired(false).setName('increment').setDescription('New counting increment.')),
    execute
}