const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { Rank } = require('canvacord');
const User = require('../../Schemas/levelingSchema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`rank`)
    .setDescription(`Команда которая скажет ваш уровень.`),

  async execute(client, interaction) {
    if (!interaction.inGuild()) {
      interaction.reply('Вы можете использовать эту команду только на сервере!');
      return;
    }

    await interaction.deferReply();
    const guildId = interaction.guildId;
    const userId = interaction.user.id;

    const guild = await client.guilds.fetch(guildId);
    const member = guild.members.cache.get(userId);

    if (!guild || !member) {
      return;
    }

    let user = await User.findOne({ guildId: guildId, userId: userId });

    if (!user) {
      user = {
        level: 1,
        xp: 0
      };
    }

    function getStatusUser(guild, userId) {
      const guildMember = guild.members.cache.find(user => user.id == userId);
      return guildMember?.presence?.status;
    }

    let rank;

    if (user.level > 100) {
      rank = new Rank()
        .setAvatar(member.displayAvatarURL({ size: 512 }))
        .setCurrentXP(user.xp)
        .setRequiredXP((user.level * user.level * user.level * 25) + 20)
        .setLevel(user.level || 1)
        .setRank(0, 0, false)
        .setStatus(getStatusUser(guild, userId))
        .setProgressBar('#FFC300', 'COLOR')
        .setUsername(member.user.username ?? 'Unknown Username');
    } else if (user.level === 100) {
      rank = new Rank()
        .setAvatar(member.displayAvatarURL({ size: 512 }))
        .setCurrentXP((user.level * user.level * user.level * 25) + 20)
        .setRequiredXP((user.level * user.level * user.level * 25) + 20)
        .setLevel(user.level || 1)
        .setRank(0, 0, false)
        .setStatus(getStatusUser(guild, userId))
        .setProgressBar('#FFC300', 'COLOR')
        .setUsername(member.user.username ?? 'Unknown Username');
    } else {
      rank = new Rank()
        .setAvatar(member.displayAvatarURL({ size: 512 }))
        .setCurrentXP(user.xp)
        .setRequiredXP((user.level * user.level * user.level * 26) + 20)
        .setLevel(user.level || 1)
        .setRank(0, 0, false)
        .setStatus(getStatusUser(guild, userId))
        .setProgressBar('#FFC300', 'COLOR')
        .setUsername(member.user.username ?? 'Unknown Username');
    }

    rank.build().then((rankData) => {
      interaction.editReply({
        files: [new AttachmentBuilder(rankData, { name: 'Rank.png' })]
      });
    });
  }
};
