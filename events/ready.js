import { ActivityType } from "discord.js";
import { ARTICLE_REQUEST_CHANNEL_ID } from '../config.js';
import setupArticleRequestCollectors from '../utils/articleRequestCollectors.js';

export const name = 'ready';
export async function execute(client) {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({ activities: [{ name: 'We currently have 4 articles.', type: ActivityType.Custom }], status: 'online' });

    // Fetch invites
    for (const guild of client.guilds.cache.values()) {
        try {
            const guildInvites = await guild.invites.fetch();
            client.guildInvites.set(guild.id, new Map(guildInvites.map(invite => [invite.code, invite.uses])));
        } catch (error) {
            console.error(`Error fetching invites for guild ${guild.name}:`, error);
        }
    }

    // Setup collectors for existing article requests
    const articleRequestChannel = client.channels.cache.get(ARTICLE_REQUEST_CHANNEL_ID);
    if (articleRequestChannel) {
        await setupArticleRequestCollectors(articleRequestChannel);
    } else {
        console.error('Article request channel not found');
    }
}
