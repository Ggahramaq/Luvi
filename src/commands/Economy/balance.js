const { SlashCommandBuilder } = require('discord.js');
const UserProfile = require('../../Schemas/userProfileSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Выдаст ваш баланс')
        .addUserOption(option => option
            .setName('target-user')
            .setDescription('Целевой участник сервера')),

    async execute(client, interaction) {
        if (!interaction.inGuild()) {
            interaction.reply({
                content: 'Эту команду можно использовать только на сервере',
                ephemeral: true
            });
            return;
        }

        await interaction.deferReply();

        try {
            const targetUserId = interaction.options.getUser('target-user')?.id || interaction.user.id;

            let userProfile = await UserProfile.findOne({ userId: targetUserId });

            if (!userProfile) {
                userProfile = new UserProfile({ userId: targetUserId });
            }

            interaction.editReply({
                content: `Баланс пользователя <@${targetUserId}>: <:Premium_Bot:1180768972971450398> ${userProfile.balance}`,
                ephemeral: true
            });
        } catch (error) {
            console.error('Ошибка при выполнении команды balance:', error);
            await interaction.editReply('Произошла ошибка при выполнении команды. Пожалуйста, попробуйте еще раз.');
        }
    }
};