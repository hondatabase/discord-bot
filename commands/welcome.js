import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('welcome')
    .setDescription('Replies with a summary of our website and community.')
    .addUserOption(option => option.setName('user')
        .setDescription('The user to reply to')
        .setRequired(true)
    );
export async function execute(interaction) {
    const user = interaction.options.getUser('user');
    const welcomeMessage = `
Welcome! 🎉

Our website is designed to be a centralized library for everything Honda. Instead of searching multiple forums and websites, you'll find everything you need in one organized, searchable place.

Contributions from the community are welcome, and the Discord serves as a forum where information can be discussed and compiled for the website. This ensures that all valuable content is preserved and easily accessible.

The goal is to provide permanent, accessible content, avoiding issues with lost or broken links. All information and images will be hosted on GitHub, ensuring that access will never end.

Feel free to ask questions and contribute your knowledge!`;

    await interaction.reply({ content: `<@${user.id}> ${welcomeMessage}`, allowedMentions: { users: [user.id] } });
}
