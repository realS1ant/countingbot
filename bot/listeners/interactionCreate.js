const { Client, Interaction } = require('discord.js');

/**
 * 
 * @param {Client} client 
 * @param {Interaction} interaction 
 */
async function execute(client, interaction) {
    if (!interaction.isCommand()) return;
    if (!client.commands.has(interaction.commandName)) return;
    try {
        await client.commands.get(interaction.commandName).execute(client, interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true }).then(() => {
            setTimeout(() => {
                interaction.deleteReply();
            }, 3500);
        });
    }
}

module.exports = {
    event: 'interactionCreate',
    execute
}