const { SlashCommandBuilder, AttachmentBuilder, Client, ChatInputCommandInteraction, PermissionFlagsBits } = require('discord.js');
const User = require('../../Schemas/levelingSchema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`setrank`)
    .setDescription(`Команда которая скажет ваш уровень.`)
    .addUserOption((option) => option .setName('member') .setDescription('Юзер которому вы хотите ресетнуть опыт') .setRequired(true))
    .addIntegerOption((option) => option .setName('level') .setDescription('На сколько вы хотите поменять лвл') .setRequired(true))
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
    const newLvl = parseFloat(interaction.options?.get('level')?.value);

    user = await User.findOne({ guildId, userId});

    try{
        if (newLvl === 0){
            await User.findOneAndUpdate(
                {guildId, userId},{level: newLvl+1, xp:(((newLvl) * (newLvl) * (newLvl)) * 25) },{upsert:true, new:true}
            ).then(() => interaction.editReply({ content: `Успешно поменяли ранг ${member.user.username} на ${newLvl+1}(нельзя поменять уровень на 0)`}))
        } else {
            if (newLvl === 1) {
            await User.findOneAndUpdate(
                {guildId, userId},{level: newLvl, xp:(((newLvl-1) * (newLvl-1) * (newLvl-1)) * 25) },{upsert:true, new:true}
            ).then(() => interaction.editReply({ content: `Успешно поменяли ранг ${member.user.username} на ${newLvl}`}))
        } else {
            await User.findOneAndUpdate(
                {guildId, userId},{level: newLvl, xp:(((newLvl-1) * (newLvl-1) * (newLvl-1)) * 25) + 20},{upsert:true, new:true}
            ).then(() => interaction.editReply({ content: `Успешно поменяли ранг ${member.user.username} на ${newLvl}`}))  
        }
    }
        
        
    } catch (e) {
        console.log(e)
    }

  }
};
