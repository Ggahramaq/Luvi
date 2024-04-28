const log = require('../../utils/log')
const { SlashCommandBuilder } = require('discord.js');
const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Кикнет пользователя из сервера которого вы выберите.')
        .addMentionableOption(option => option.setName('пользователь').setDescription('Пользователь которого вы хотите забанить.').setRequired(true))
        .addStringOption(option => option.setName('причина').setDescription('Причина по которой вы хотите забанить.'))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    execute: async (client, interaction) => {
        const targetUserId = interaction.options.get('пользователь').value;
        const reason = interaction.options.get('причина')?.value || "Не было причины.";

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(targetUserId);

        if (!targetUser) {
            await interaction.editReply("Этого пользователя нету на сервере!");
            return;
        }

        if (targetUser.id === interaction.guild.ownerId) {
            await interaction.editReply("Вы не можете кикнуть создателя сервера!");
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position;
        const requestUserRolePosition = interaction.member.roles.highest.position;
        const botRolePermission = interaction.guild.members.me.roles.highest.position;

        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply("Я не могу кикнуть этого пользователя т.к. этот пользователь имеет выше права чем вы/одинаковые права")
            return;
        }

        if (targetUserRolePosition >= botRolePermission) {
            await interaction.editReply("Я не могу кикнуть этого пользователя т.к. он имеет выше права чем я.")
            return;
        }

        try {
            await targetUser.kick({ reason });
            await interaction.editReply(`Пользователь ${targetUser} был кикнут с сервера! Причина: ${reason}`);
        } catch (error) {
            log({ text: `Произошла ошибка во время кика. Ошибка: ${error}` })
        }
    }
}