const { getColor } = require("../../utils");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle: { Link } } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setNameLocalizations({
			'en-US': 'avatar',
			ru: 'аватар',
		})
		.setDescription('Получить аватар пользователя')
		.setDescriptionLocalizations({
			'en-US': 'Get user avatar',
			ru: 'Получить аватар пользователя',
		})
		.addUserOption(option => option
			.setName('участник')
			.setDescription('Целевой участник')
			.setDescriptionLocalizations({
				'en-US': 'Target member',
				ru: 'Целевой участник',
			}))
		.setDMPermission(false),
	async execute(client, interaction) {

		const { user } = interaction.options?.get('участник') || interaction;
		await interaction.guild.members.fetch();
		const member = interaction.guild.members.cache.get(user.id);

		const guildAvatarURL = member.displayAvatarURL();
		const avatarURL = user.displayAvatarURL();
		const colorAvatar = await getColor(avatarURL.replace('.webp', '.png'));

		const userName = (member.nickname || user.username).replace(/\*|\\|\/|\||_|~|`/gi, "\\$&");

		const embeds = [
			new EmbedBuilder()
				.setColor(colorAvatar)
				.setDescription(`Ссылки на аватарку в разных размерах:
	[512x512](${avatarURL}?size=512), [**256x256**](${avatarURL}?size=256), [128x128](${avatarURL}?size=128)`)
				.setTitle(`Аватар **${userName}**`)
				.setImage(`${avatarURL}?size=256`)
		];

		const components = guildAvatarURL != avatarURL ? [new ActionRowBuilder()
			.addComponents(new ButtonBuilder().setStyle(Link)
				.setLabel('Серверная аватарка')
				.setURL(`${guildAvatarURL}?size=512`)
				.setEmoji('👀'))] : [];

		
		await interaction.reply({ embeds, components });
	}
};