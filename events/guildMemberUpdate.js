const handleRoleChanges = require('../handlers/RoleChangeHandler');

module.exports = {
    name: 'guildMemberUpdate',
    async execute(client, oldMember, newMember) {
        handleRoleChanges(oldMember, newMember);
    },
};
