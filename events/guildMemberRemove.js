import formatDuration from '../utils/formatDuration.js';
import { STAFF_CHANNEL_ID } from '../config.js';

export async function execute(client, member) {
    const { user, guild, joinedAt } = member;
    const username = user.username;
    const staffChannel = guild.channels.cache.get(STAFF_CHANNEL_ID);

    console.log(`Member left: ${username}`);

    if (staffChannel) {
        staffChannel.send(`👋 **Member left** 👋\nUsername: **${username}**\nStayed for: **${formatDuration(Date.now() - joinedAt)}**`);
    }
}
