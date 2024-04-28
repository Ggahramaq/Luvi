const { SlashCommandBuilder, AttachmentBuilder, Client, ChatInputCommandInteraction, PermissionFlagsBits } = require('discord.js');
const User = require('../../Schemas/levelingSchema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`resetrank`)
    .setDescription(`Команда которая скажет ваш уровень.`)
    .addUserOption((option) => option .setName('member') .setDescription('Юзер которому вы хотите ресетнуть опыт') .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  
    async execute(client, interaction) {
    if (!interaction.inGuild()) {
      interaction.reply('Вы можете использовать эту команду только на сервере!');
      return;
    }

    /**
     * @param {ChatInputCommandInteraction} interaction
     */

    await interaction.deferReply();
    const guildId = interaction.guildId;
    let user;
    const userId = interaction.user.id;
    const member =interaction.options?.get('member');

    user = await User.findOne({ guildId, userId});

    try{

        await User.findOneAndUpdate(
            {guildId, userId},{level: 1, xp:0},{upsert:true, new:true}
        ).then(() => interaction.editReply({ content: `Успешно сбросили ранг ${member.user.username}`}))
    } catch (e) {
        console.log(e)
    }

  }
};
