const { SlashCommandBuilder } = require('discord.js');
const UserProfile = require('../../Schemas/userProfileSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Показывает таблицу с самыми богатыми людьми.'),

        async execute(client, interaction) {
            try {
                await interaction.deferReply();
    
                const topUsers = await UserProfile.find().sort({ balance: -1 }).limit(10);
    
                const userIndex = topUsers.findIndex(user => user.userId === interaction.member.id);
                const userRank = userIndex !== -1 ? userIndex + 1 : 'Not ranked yet :(';
    
                const topEmbed = {
                    color: 0xffd700,
                    title: 'Топ 10 богатых людей',
                    description: topUsers.map((user, index) => `${index + 1}. <@${user.userId}>: ${user.balance} <:Premium_Bot:1180768972971450398>`).join('\n'),
                    footer: {
                        text: `Ваш ранк: ${userRank}`,
                    },
                };
    
                await interaction.editReply({ embeds: [topEmbed] });
            } catch (error) {
                console.error('Error executing top command:', error);
                await interaction.editReply('Произошла ошибка! Попробуйте позже.');
            }
        }
};