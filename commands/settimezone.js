const { SlashCommandBuilder } = require('discord.js');
const moment = require('moment-timezone');
const { saveTimezone } = require('../handlers/TimezoneHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('settimezone')
        .setDescription('Sets your timezone.')
        .addStringOption(option => 
            option.setName('timezone')
                .setDescription('Your timezone (e.g., America/New_York)')
                .setRequired(true)
        ),
    async execute(interaction) {
        const timezone = interaction.options.getString('timezone');

        if (!moment.tz.zone(timezone)) {
            return interaction.reply({
                content  : `❌ Invalid timezone! Please refer to [this list of available timezones](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) and use a valid timezone (e.g., America/New_York).`,
                ephemeral: true,
            });
        }

        // Save the user's timezone if valid
        saveTimezone(interaction.user.id, timezone);

        await interaction.reply(`${interaction.user} has set their timezone to \`${timezone}\`.`);
    }
};