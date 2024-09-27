const { SlashCommandBuilder } = require('discord.js');
const { INVITE_URL } = require('../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('inviteurl')
        .setDescription('Replies with the invite URL for the server.'),
    async execute(interaction) {
        await interaction.reply(`Here's the invite link for our server: ${INVITE_URL}`);
    }
};
