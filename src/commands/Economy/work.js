const { SlashCommandBuilder } = require('discord.js');
const Cooldown = require('../../Schemas/cooldownSchema');
const UserProfile = require('../../Schemas/userProfileSchema');

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

module.exports = {
    data: new SlashCommandBuilder()
    .setName('work')
    .setDescription('Выдаст вам от 10 до 135 монет.'),

    async execute(client, interaction) {
        if (!interaction.inGuild()) {
            interaction.reply({
                content: `Вы не можете использовать команду в ЛС!`,
                ephemeral: true,
            });
            return;
        }

        try {
            await interaction.deferReply();

            const commandName = 'work';
            const userId = interaction.member.id;

            let cooldown = await Cooldown.findOne({ userId, commandName });

            if ( cooldown && Date.now() < cooldown.endsAt) {
                const { default: prettyMs } = await import('pretty-ms');

                await interaction.editReply(
                    `У тебя сейчас кулдаун! Ты сможешь ввести команду через ${prettyMs(cooldown.endsAt - Date.now())}`
                );
                return;
            }

            if (!cooldown) {
                cooldown = new Cooldown({ userId, commandName});
            }

            const amount = getRndInteger(10, 135);

            let userProfile = await UserProfile.findOne({ userId}).select('userId balance');

            if (!userProfile) {
                userProfile = new UserProfile({ userId });
            }

            userProfile.balance += amount;
            cooldown.endsAt = Date.now() + 300_000;

            await Promise.all([cooldown.save(), userProfile.save()]);

            await interaction.editReply(`<:Premium_Bot:1180768972971450398> Вы получили ${amount} монет!\n Ваш баланс: ${userProfile.balance}<:Premium_Bot:1180768972971450398>`)
        } catch(e) {
            console.log(e)
        }
    }
};