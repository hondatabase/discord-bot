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

(async () => {
    const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) client.commands.set(file.split('.')[0], await import(`./commands/${file}`));

    const eventFiles = readdirSync('./events').filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const event     = await import(`./events/${file}`);
        const eventName = file.split('.')[0];

        client.on(eventName, (...args) => event.execute(client, ...args));
    }
})().then(() => client.login(BOT_TOKEN));
