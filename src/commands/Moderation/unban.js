const { Client, Interaction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Разбанивает пользователя.')
        .addStringOption(option => option.setName('пользователь').setDescription('ID пользователя, которого вы хотите разбанить.').setRequired(true))
        .addStringOption(option => option.setName('причина').setDescription('Причина разбана.'))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    async execute(client, interaction) {
        const userId = interaction.options.getString('пользователь');
        const reason = interaction.options.getString('причина') || 'Не указана';

        await interaction.deferReply();

        try {
            const user = await client.users.fetch(userId);
            await interaction.guild.members.unban(user, reason);

            await interaction.editReply(`Пользователь ${user.tag} был разбанен! Причина: ${reason}`);
        } catch (error) {
            console.error(error);
        }
    },
};
