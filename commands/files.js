const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('files')
        .setDescription('Replies with the URL for our Files Archive (contains mostly legacy files).'),
    async execute(interaction) {
        await interaction.reply("Here's the link for the File Archive: https://files.hondatabase.com");
    }
};
