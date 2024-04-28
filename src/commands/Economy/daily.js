const { SlashCommandBuilder } = require('discord.js');
const UserProfile = require('../../Schemas/userProfileSchema');
const Cooldown = require('../../Schemas/cooldownSchema');

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const dailyAmount = getRndInteger(300, 500);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Команда, которую можно использовать ежедневно. После использования команды вы получаете монеты.'),

    async execute(client, interaction) {
        if (!interaction.inGuild()) {
            interaction.reply({
                content: 'Вы не можете использовать команду в ЛС!',
                ephemeral: true,
            });
            return;
        }
    
        try {
            await interaction.deferReply();
    
            const commandName = 'daily';
            const userId = interaction.member.id;
    
            let cooldown = await Cooldown.findOne({ userId, commandName });
    
            if (cooldown && Date.now() < cooldown.endsAt) {
                const { default: prettyMs } = await import('pretty-ms');
    
                await interaction.editReply(
                    `У вас сейчас кулдаун! Вы сможете ввести команду через ${prettyMs(cooldown.endsAt - Date.now())}`
                );
                return;
            }
    
            if (!cooldown) {
                cooldown = new Cooldown({ userId, commandName });
            }
    
            let userProfile = await UserProfile.findOne({
                userId: interaction.member.id,
            });
    
            userProfile.balance += dailyAmount;
            userProfile.lastDailyDateCollected = new Date();
            cooldown.endsAt = Date.now() + 86400_000;
    
            await Promise.all([cooldown.save(), userProfile.save()]);
            interaction.editReply(
                `<:Premium_Bot:1180768972971450398> ${dailyAmount} монет было начислено на ваш баланс.\n Ваш баланс: ${userProfile.balance}<:Premium_Bot:1180768972971450398>`
            );
    
        } catch (error) {
            console.error('Ошибка при выполнении команды daily:', error);
            await interaction.editReply('Произошла ошибка при выполнении команды. Пожалуйста, попробуйте еще раз.');
        }
    
    }
    
};
