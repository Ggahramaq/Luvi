const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('subtract')
    .setDescription(`Вычтет любые числа.`)
    .addIntegerOption(option => option
        .setName('первое-число')
        .setDescription('Первое число.')
        .setRequired(true))
    .addIntegerOption(option => option
        .setName('второе-число')
        .setDescription('Второе число.')
        .setRequired(true))
    .addIntegerOption(option => option
        .setName('третье-число')
        .setDescription('Третье число.')
        .setRequired(false))
    .addIntegerOption(option => option
        .setName('четвертое-число')
        .setDescription('Четвертое число.')
        .setRequired(false))
    .addIntegerOption(option => option
        .setName('пятое-число')
        .setDescription('Пятое число.')
        .setRequired(false)),

    async execute(client, interaction) {
        const first = parseFloat(interaction.options.get('первое-число').value);
        const second = parseFloat(interaction.options.get('второе-число').value);
        const third = parseFloat(interaction.options?.get('третье-число')?.value || 0);
        const fourth = parseFloat(interaction.options?.get('четвертое-число')?.value || 0);
        const fifth = parseFloat(interaction.options?.get('пятое-число')?.value || 0);

        const result = first - second - third - fourth - fifth;

        const embed = new EmbedBuilder()
        .setTitle('Ответ:')
        .setColor('Blurple')
        .setDescription(`${result}`)

        interaction.reply({ embeds: [embed]});
    }
}