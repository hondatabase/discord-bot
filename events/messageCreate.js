const moment = require('moment-timezone');
const { PermissionFlagsBits } = require('discord.js');

const { getUserTimezone } = require('../handlers/TimezoneHandler');
const { STAFF_CHANNEL_ID } = require('../config');
const INVITE_LINK_REGEX = /(discord\.gg\/|discord\.com\/invite\/)/i;

module.exports = {
	name: 'messageCreate',
	async execute(_, message) {
		if (message.author.bot) return;

		// Check for Discord invite links
		if (INVITE_LINK_REGEX.test(message.content)) {
			if (message.member.permissions.has(PermissionFlagsBits.Administrator)) return;

			await message.delete().catch(console.error); // Delete the message
			await message.channel.send(`${message.author}, posting invite links is not allowed!`).then(msg => setTimeout(() => msg.delete(), 5000));

			// Post the original message and details to the staff channel
			const staffChannel = message.guild.channels.cache.get(STAFF_CHANNEL_ID);
			if (staffChannel) {
				staffChannel.send(`🚨 **Invite Link Blocked** 🚨\n**User:** ${message.author.tag} (${message.author.id})\n**Message:** ${message.content}`);
			} else {
				console.error(`Staff channel with ID ${STAFF_CHANNEL_ID} not found.`);
			}
		}

		// Check mentions for timezones
        message.mentions.users.forEach(user => {
            const timezone = getUserTimezone(user.id);
            if (timezone && moment.tz(timezone).hours() === 0) message.channel.send(`⚠️ It is past midnight for ${user.username}. Please consider messaging them later.`);
        });
	}
};
