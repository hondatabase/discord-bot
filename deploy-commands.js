import { REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';

import { BOT_TOKEN, BOT_CLIENT_ID } from './config.js';

if (!BOT_TOKEN || !BOT_CLIENT_ID) {
    console.error('Missing environment variables. Please check your .env file.');
    process.exit(1);
}

const commands = [];

// Read command files from the commands directory
const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'));

console.log('Gathering commands...');
for (const file of commandFiles) {
    const { data } = await import(`./commands/${file}`);
    commands.push(data.toJSON());
}
console.log(`Found: ${commands.map(command => command.name).join(', ')}`);

(async () => {
    const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

    try {
        console.log('Started refreshing application (/) commands.');

        // Register commands globally
        await rest.put(Routes.applicationCommands(BOT_CLIENT_ID), { body: commands });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
