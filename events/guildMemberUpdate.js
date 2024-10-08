import handleRoleChanges from '../handlers/RoleChangeHandler.js';

export async function execute(client, oldMember, newMember) {
    handleRoleChanges(oldMember, newMember);
}
