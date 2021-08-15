const { SlashCommandBuilder, SlashCommandStringOption, SlashCommandIntegerOption } = require('@discordjs/builders');
const { Interaction, Client, Permissions } = require('discord.js');
const { createChannel } = require('../utils');
/**
 * 
 * @param {Client} client
 * @param {Interaction} interaction 
 */
async function execute(client, interaction) {
    if (!interaction.isCommand()) return;

    if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
        interaction.reply(':x: Sorry, this command is reserved for thos with the `MANAGE_CHANNELS` permission only!');
        return;
    }

    const name = interaction.options.getString('name', true);
    let goal = interaction.options.getInteger('goal', false);
    let increment = interaction.options.getInteger('increment', false);
    if (!goal) goal = 100;
    if (!increment) increment = 1;

    const channel = await interaction.guild.channels.create(name, {
        type: 'GUILD_TEXT',
        reason: `Counting channel created by ${interaction.user.username}#${interaction.user.discriminator}`,
        parent: null,
        nsfw: false,
        topic: `Counting Channel | Goal: ${goal} by increments of ${increment}`,
    });
    channel.sendTyping();
    const msg = await channel.send(`Welcome to the new counting channel, **${name}**! Here we will count up to **${goal}**${increment == 1 ? '.' : ' by **' + increment + '**s!'}\n**Good Luck**, I'll start!`);
    await msg.pin().then(msg => {
        msg.channel.lastMessage.delete(); //Using awaits for everything didn't work consistently.
    });
    await channel.send('0');
    await createChannel({ channelId: channel.id, increment, goal });

    interaction.reply(':white_check_mark: Channel created!');
}

module.exports = {
    data: new SlashCommandBuilder().setName('setup').setDescription('Used to setup a counting channel in your guild!')
        .addStringOption(new SlashCommandStringOption().setRequired(true).setName('name').setDescription('The name of the counting channel.'))
        .addIntegerOption(new SlashCommandIntegerOption().setRequired(false).setName('goal').setDescription('The final goal for this counting channel, defaults to 100.'))
        .addIntegerOption(new SlashCommandIntegerOption().setRequired(false).setName('increment').setDescription('The increment to count at, defaults to 1.')),
    execute
}