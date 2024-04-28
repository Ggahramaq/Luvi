const {SlashCommandBuilder} = require('discord.js');
const UserProfile = require('../../Schemas/userProfileSchema');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('roulette')
    .setDescription('Рулетка с шансом выйгрыша 50%')
    .addIntegerOption(option => option
        .setName('amount')
        .setDescription('Сколько денег вы хотите потратить на рулетку.')
        .setRequired(true)),


    async execute(client, interaction) {
        if (!interaction.inGuild()) {
            interaction.reply({
                content: "Эту команду можно использовать только на сервере",
                ephemeral: true
            });
            return;
        }


        const amount = parseFloat(interaction.options?.get('amount').value);

        if (amount < 100) {
            interaction.reply("Вы должны поставить минимум 100<:Premium_Bot:1180768972971450398> !")
            return;
        }

        let userProfile = await UserProfile.findOne({
            userId: interaction.user.id,
        });

        if (!userProfile) {
            userProfile = new UserProfile({ userId: interaction.user.id });
        }

        if (amount > userProfile.balance) {
            interaction.reply("У вас недостаточно денег чтоб начать рулетку!");
            return;
        }

        const didWin = Math.random() > 0.5;

        if (!didWin) {
            userProfile.balance -= amount;
            await userProfile.save();

            interaction.reply('Вы не выйграли в этот раз!');
            return;
        }
        
        const amountWon = (amount * 2)
        
        userProfile.balance += amountWon;
        await userProfile.save();

        interaction.reply(`Вы выйграли ${amountWon}<:Premium_Bot:1180768972971450398>!\n Ваш баланс: ${userProfile.balance}<:Premium_Bot:1180768972971450398>`)

        try {
            
        } catch (e) {
            console.log(e);
        }
    }
};