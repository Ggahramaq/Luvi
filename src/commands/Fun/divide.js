const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('divide')
    .setDescription(`Делит любые числа.`)
    .addIntegerOption(option => option
        .setName('первое-число')
        .setDescription('Первое число.')
        .setRequired(true))
    .addIntegerOption(option => option
        .setName('второе-число')
        .setDescription('Второе число.')
        .setRequired(true)),

    async execute(client, interaction) {
        const first = parseInt(interaction.options.get('первое-число').value);
        const second = parseInt(interaction.options.get('второе-число').value);

        const result = first / second;

        if (second == 0) {
            interaction.reply('Нельзя делить на 0!')
            return;
            }

        const embed = new EmbedBuilder()
        .setTitle('Ответ:')
        .setColor('Blurple')
        .setDescription(`${result}`)

        interaction.reply({ embeds: [embed]});
    }
}