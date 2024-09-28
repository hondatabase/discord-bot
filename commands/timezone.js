// Retrieves the timezone of a user and calculates the diff between them and the command author.
const { SlashCommandBuilder } = require('@discordjs/builders');
const moment = require('moment-timezone');

const { getUserTimezone } = require('../handlers/TimezoneHandler');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('timezone')
		.setDescription('Get the timezone of a user.')
		.addUserOption(option => option.setName('user').setDescription('The user to get the timezone of').setRequired(true)),
	async execute(interaction) {
		const user   = interaction.options.getUser('user');
		const author = interaction.user;

		if (user === author) return await interaction.reply({ content: 'You are in the same timezone as yourself. :thinking:', ephemeral: true });	

		// TZ "string" Identifiers
		let userTimezone   = await getUserTimezone(user.id);
		let authorTimezone = await getUserTimezone(author.id);

		if (!userTimezone) return await interaction.reply({ content: `The timezone of ${user} is unknown.`, ephemeral: true });
		if (!authorTimezone) return await interaction.reply(`The timezone of ${user} is ${userTimezone}.`);
		
		const userTimezoneHours   = moment.tz(userTimezone).utcOffset() / 60;   
		const authorTimezoneHours = moment.tz(authorTimezone).utcOffset() / 60; 

		const message = `The timezone of **${user.displayName}** is \`${userTimezone}\`. `;
		const diff    = Math.abs(userTimezoneHours - authorTimezoneHours);

		await interaction.reply(message + (diff == 0 ? 'There\'s not time difference between you and them.' : `They are ${diff} hour(s) ${userTimezoneHours > authorTimezoneHours ? 'ahead' : 'behind'} you.`));
	}
};