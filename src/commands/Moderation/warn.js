const { SlashCommandBuilder, PermissionFlagsBits} = require('discord.js')
const { EmbedBuilder } = require('discord.js')
const WarnSchema = require(`../../Schemas/warnSchema`)

module.exports = {
	data: new SlashCommandBuilder()
	.setName('warn')
    .setDescription("Это выдаст предупреждение пользователю.")
    .addUserOption(option => option.setName("юзер").setDescription("Юзер которому вы хотите выдать предупреждение").setRequired(true))
	.addStringOption(option => option.setName("причина").setDescription("Причина по которой вы хотите выдать предупреждение").setRequired(true))
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(client, interaction) {
	   const { options, guildId, user } = interaction;
		const usuario = options.getUser("юзер");
		const motivo = options.getString("причина");
        const userTag = `${usuario.username}#${usuario.discriminator}`
		WarnSchema.findOne({ GuildID: guildId, UserID: usuario.id, UserTag: usuario.tag}, async (err, data) => {
			if (err) throw err 
            if (!data) {
               data = new WarnSchema({
				   GuildID: guildId,
				   UserID: usuario.id,
				   UserTag: userTag,
				   Content: [
					   {
					   ExecuterId: usuario.id,
					   ExecuterTag: usuario.tag,
					   Reason: motivo
					   }
				   ],
			   });
           } else {
				const warnContent = {
					ExecuterId: usuario.id,
					ExecuterTag: usuario.tag,
					Reason: motivo
				}
				data.Content.push(warnContent);
		   }
           data.save()
		});
		const embed = new EmbedBuilder()
		.setColor("Blue")
		.setDescription(`Вам выдали **предупреждение** на сервере ${interaction.guild.name} \nПричина: ${motivo}`)

		const embed2 = new EmbedBuilder()
		.setColor("Blue")
		.setDescription(`**> Вы выдали предупреждение пользователю ${usuario.username} **\n Причина: **${motivo}**`)
		.setTimestamp()
		.setThumbnail(usuario.displayAvatarURL({ dynamic: true }));
		usuario.send({ embeds: [embed]}).catch(err => {
			return;
		});

		interaction.reply({ embeds: [embed2]})
	}
}