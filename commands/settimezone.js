import { SlashCommandBuilder } from 'discord.js';
import moment from 'moment-timezone';
import { saveTimezone } from '../handlers/TimezoneHandler.js';
import { HANGOUT_CHANNEL_ID } from '../config.js';

export const data = new SlashCommandBuilder()
    .setName('settimezone')
    .setDescription('Sets your timezone.')
    .addStringOption(option => option.setName('timezone')
        .setDescription('Your timezone (e.g., America/New_York)')
        .setRequired(true)
    );
export function execute(interaction) {
    const timezone = interaction.options.getString('timezone');

    if (!moment.tz.zone(timezone)) {
        return interaction.reply({
            content: `❌ Invalid timezone! Please refer to [this list of available timezones](https://en.wikipedia.org/wiki/List_of_moment.tz_database_time_zones) and use a valid timezone (e.g., America/New_York).`,
            ephemeral: true,
        });
    }

    // Save the user's timezone if valid
    saveTimezone(interaction.user.id, timezone);

    const hangoutChannel = interaction.client.channels.cache.get(HANGOUT_CHANNEL_ID);

    if (hangoutChannel) hangoutChannel.send(`${interaction.user} has set their timezone to \`${timezone}\}.`);

    interaction.reply({ content: '✅ Timezone set successfully!', ephemeral: true });
}