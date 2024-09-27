module.exports = {
    name: 'interactionCreate',
    async execute(client, interaction) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
            console.log(`${interaction.user.tag} executed command ${command.data.name}`);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error executing that command!', ephemeral: true });
        }
    }
};
