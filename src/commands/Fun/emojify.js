const { Emojify } = require('discord-gamecord');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('emojify')
    .setDescription(`Превратит строчку в эмодзи`)
    .addStringOption(option => option
        .setName('слово')
        .setDescription('слово которую вы хотите превратить в эмодзи.')
        .setRequired(true)),
    async execute(client, interaction) {
        try{
            Text = interaction.options.getString('слово'),
        interaction.reply(await Emojify(Text));
        } catch(e) {
            interaction.reply('<:icons_Wrong:1187788186005536798> Пожалуйста, напишите **слово** на **английском**')
        }
        
     }
}