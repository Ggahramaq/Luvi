const { SlashCommandBuilder, EmbedBuilder} = require ('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Покажет все команды которые есть в боте.'),

    async execute(client, interaction) {
        const commands = client.commands;
        let index = 1;
        const commandList = commands.map((command) => `${index++}. **/${command.data.name}**: ${command.data.description}`).join('\n');
        await interaction.reply({ content: `# Команды бота:\n ${commandList}` });
        
    }
};
