import { SlashCommandBuilder } from 'discord.js';
import { INVITE_URL } from '../config.js';

export const data = new SlashCommandBuilder()
    .setName('inviteurl')
    .setDescription('Replies with the invite URL for the server.');
export async function execute(interaction) {
    await interaction.reply(`Here's the invite link for our server: ${INVITE_URL}`);
}
