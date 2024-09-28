const getBlacklist = require('../utils/getBlacklist');
const { STAFF_CHANNEL_ID } = require('../config');

module.exports = {
    name: 'guildMemberAdd',
    async execute(client, member) {
        const { user, guild } = member;
        const username = user.username;
        
        console.log(`New member joined: ${username}`);
        
        let inviter = 'Unknown';
        try {
            const newInvites = await guild.invites.fetch();
            const oldInvites = client.guildInvites.get(guild.id) || new Map();
            const invite     = newInvites.find(i => i.uses > (oldInvites.get(i.code) || 0));
            
            if (invite) inviter = invite.inviter.tag;
            
            client.guildInvites.set(guild.id, new Map(newInvites.map(invite => [invite.code, invite.uses])));
        } catch (error) {
            console.error('Error tracking inviter:', error);
        }
        
        const staffChannel = guild.channels.cache.get(STAFF_CHANNEL_ID);
        if (staffChannel) staffChannel.send(`👥 **New member** 👥\nUser: **${user}**\nInvited by: **${inviter}**`);

        // Read blacklisted users from file
        const blacklisted = await getBlacklist();
        if (blacklisted[username]?.active) {
            const reason = blacklisted[username].reason || 'No reason provided';

            member.timeout(24 * 60 * 60 * 1000, reason).then(() => console.log(`Timed out ${username} for 24 hours`)).catch(console.error);

            if (staffChannel)
                staffChannel.send(`⚠️ **Alert** ⚠️\nUser **${user}** has been timed out for 24 hours. Reason: ${reason}`);
            else
                console.error('Admin channel not found');
        }
    }
};
