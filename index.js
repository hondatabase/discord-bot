import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { readdirSync } from 'fs';

import { BOT_TOKEN } from './config.js';

export const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMembers, 
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent
    ],
    partials: ["MESSAGE", "CHANNEL", "REACTION", "GUILD_MEMBER"]
});

client.commands     = new Collection();
client.guildInvites = new Collection();

// Load command files
const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) client.commands.set(file.split('.')[0], import(`./commands/${file}`));

// Load events files
const eventFiles = readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event     = await import(`./events/${file}`);
    const eventName = file.split('.')[0];

    console.log(`Loading event: ${eventName}`);
    client.on(eventName, (...args) => event.execute(client, ...args));
}

client.login(BOT_TOKEN);
