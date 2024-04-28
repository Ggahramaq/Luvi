const {SlashCommandBuilder, hyperlink, ChatInputCommandInteraction, EmbedBuilder, AttachmentBuilder} = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Посмотреть информацию о пользователе')
        .setDMPermission(false)
        .addUserOption((option) => option .setName('member') .setDescription('Пользователь которого вы хотите посмотреть')),

        /**
         *  
         * @param {ChatInputCommandInteraction} interaction 
         */
        async execute(client, interaction) {
            await interaction.deferReply();
            const member = 
            interaction.options.getMember('member') || interaction.member;

            if (member.user.bot)
            return interaction.editReply({
        embeds: [
            new EmbedBuilder().setDescription(
                "Бот не может использовать эту команду!"
            ),
        ],
        ephemeral: true,
    });
   
    
try{

    const fetchedMembers = await interaction.guild.members.fetch();


    

    const topRoles = member.roles.cache
    .sort((a, b) => b.position - a.position)
    .map((role) => role)
    .slice(0, 3);

    const userBadges = member.user.flags.toArray();

    
    const joinTime2 = parseInt(member.joinedTimestamp / 1000)
    const createdTime = Math.round(member.user.createdTimestamp / 1000);
    
    
    const Booster = member.premiumSince
    ? "<:emoji_20:1182362982018195488>"
    : "✖";

    const Embed = new EmbedBuilder()
    .setAuthor({
        name: `${member.user.tag} | Информация`,
        iconURL: member.displayAvatarURL(),
    })
    .setColor("Blurple")
    .setDescription(
        `В <t:${joinTime2}:D> ${
            member.user.username
        } зашел на сервер`
    )
    .addFields([
        {
            name: `Ачивки`,
            value: `${addBadges(userBadges).join("")}`,
            inline: true,
        },
        { name: `Бустер`, value: `${Booster}`, inline: true},
        { name: `Высокие роли`, value: `${topRoles.join("")}`, inline: true},
        { name: `Аккаунт создан`, value: `<t:${createdTime}:R>`, inline: true},
        { name: `Зашел на сервер`, value: `<t:${joinTime2}:R>`, inline: true},
        { name: `ID`, value: `${member.id}`, inline: true},
        {
            name: `Аватар`,
            value: `${hyperlink("Ссылка", member.displayAvatarURL())}`,
            inline: true,
        },
        {
            name: `Баннер`,
            value: `[Ссылка](${
                (await member.user.fetch()).bannerURL() ||
                member.displayAvatarURL()
            })`,
            inline: true,
        }
    ]);

    await interaction.editReply({ embeds: [Embed] });




} catch(e){
    console.log(e);
    interaction.editReply({
        content: 'Произошла ошибка! пожалуйста свяжитесь с администратором.'
    });
    throw e;
}  

    },
};



function addBadges(badgeNames) {
    if (!badgeNames.length) return ["X"];
    const badgeMap = {
      ActiveDeveloper: "<:activedev:1180766521136525362>",
      BugHunterLevel1: "<:BugHunter:1187454867908862062>",
      BugHunterLevel2: "<:BugHunter2:1187613974091550732>",
      PremiumEarlySupporter: "<:EarlySupporter:1187614605422383224>",
      Partner: "<:partner:1187614102810542130>",
      Staff: "<:Staff:1187614742009892917>",
      HypeSquadOnlineHouse1: "<:Bravery:1187614898763595899>", 
      HypeSquadOnlineHouse2: "<:Brilliance:1187614995681390673>", 
      HypeSquadOnlineHouse3: "<:Balance:1187615141651546122>", 
      Hypesquad: "<:Hypesquad:1187615228679159878>",
      CertifiedModerator: "<:DiscordMod:1187615357599490048>",
      VerifiedDeveloper: "<:VerifiedDev:1187615461299453997>",
    };
  
    return badgeNames.map((badgeName) => badgeMap[badgeName] || "❔");
  }