const { SlashCommandBuilder, EmbedBuilder, ChannelType} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
      .setName('serverinfo')
      .setDescription('Посмотреть информацию о сервере')
      .setDMPermission(false),

      async execute(client, interaction) {

        const {guild} = interaction;
        const { members, channels, emojis, roles, stickers} = guild;

        const botCount = members.cache.filter(member => member.user.bot).size.toString();
        const onlineCount = guild.members.cache.filter(member => member.presence?.status == 'online').size.toString();
        const offlineCount = guild.members.cache.filter(member => member.presence?.status == undefined).size.toString();
        const dndCount = guild.members.cache.filter(member => member.presence?.status == 'dnd').size.toString();
        const idleCount = guild.members.cache.filter(member => member.presence?.status == 'idle').size.toString();
        const getChannelTypeSize = type => channels.cache.filter(channel => type.includes(channel.type)).size;
        const totalChannels = getChannelTypeSize([ ChannelType.GuildText, ChannelType.GuildNews, ChannelType.GuildVoice, ChannelType.GuildStageVoice, ChannelType.GuildForum, ChannelType.GuildPublicThread, ChannelType.GuildPrivateThread, ChannelType.GuildNewsThread, ChannelType.GuildCategory]);
        const embed = new EmbedBuilder()
        .setColor('Blue')
        .setTitle(`Информация о сервере ${guild.name}`)
        .setThumbnail(guild.iconURL({ size: 1024}))
        .addFields(
            { 
                name: "Общая информация",
                value: [
                    `:page_facing_up: **Сервер был создан: <t:${parseInt(guild.createdTimestamp / 1000)}:R>**`,
                    `:credit_card: **ID:** ${guild.id}`,
                    `:crown: **Овнер** <@${guild.ownerId}>`,
                    `:link: **Вечная ссылка:** ${guild.vanityURLCode || "На этом сервере нету вечной ссылки!"}`
                ].join(["\n"])
            },
            { name: `Участники (${guild.memberCount})`,
            value: [
                `<:3114bluemember:1182364068472967248> **Людей:** ${guild.memberCount - botCount}`,
                `<:Bot:1187646758503854170> **Ботов:** ${botCount}`,
                `<:Online:1187634002555834388> **Онлайн:** ${onlineCount}`,
                `<:Offline:1187633926399873064> **Офлайн:** ${offlineCount}`,
                `<:DND:1187634210723340348> **Не беспокоить:** ${dndCount}`,
                `<:Idle:1187634140317765642> **Не активен:** ${idleCount}`,
            ].join("\n"),
            inline: true
            },
            { name: `Каналы, ветки и категории`,
                value: [
                    `<:icons_channel:1187648829030420570> **Всего каналов:** ${totalChannels}`,
                    `:speech_balloon: **Текстовые каналы:** ${getChannelTypeSize([ChannelType.GuildText, ChannelType.GuildForum, ChannelType.GuildNews])}`,
                    `<:icons_callconnect:1187650642785878046> **Голосовые каналы:** ${getChannelTypeSize([ChannelType.GuildVoice, ChannelType.GuildStageVoice])}`,
                    `:thread: **Ветки:** ${getChannelTypeSize([ChannelType.GuildPrivateThread, ChannelType.GuildPublicThread, ChannelType.GuildNewsThread])}`,
                ].join("\n"),
                inline: true
            },
            { name: `Бусты`,
                value: [
                    `<:emoji_20:1182362982018195488> **Уровень:** ${guild.premiumTier || "Нету"}`,
                    `<:boost:1187654953897041922> **Бустов:** ${guild.premiumSubscriptionCount}`,
                    `<a:AnimatedBoost:1187654764964614147> **Бустеры:** ${guild.members.cache.filter(member => member.roles.premiumSubscriptionRole).size}`,
                    `<a:server_boosting:1187655133736218644> **Всего бустеров:** ${guild.members.cache.filter(member => member.roles.premiumSince).size}`,
                ].join("\n"),
                inline: true
            },
        )
        interaction.reply({ embeds: [embed]});
      }
}