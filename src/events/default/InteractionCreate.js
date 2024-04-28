const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, ChannelType, EmbedBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');
const log = require('../../utils/log');


module.exports = {
    name: 'interactionCreate',
    async exec(client, interaction) {
        
        const { member, user } = interaction;
		const username = member?.nickname || user?.globalName || user?.username;
        if (interaction.isCommand() || interaction.isUserContextMenuCommand()) {
			var options = '';
			if (interaction.options) {
				for (const option of interaction.options._hoistedOptions) {
					const { name, value, member, user } = option;

					var newUsername = (member?.nickname || user?.globalName || user?.username);
					newUsername = newUsername ? `${newUsername} (${value})` : '';

					options = `${options}${name}: ${newUsername || value} `;
				}
			}
			if (interaction.isUserContextMenuCommand()) {
				return log({ author: username, text: `[Приложение] ${interaction.commandName} ${options}`.trim(), mode: 'chat', status: true });
			}
			else if (interaction.isCommand()) {
				const cmd = client.commands.get(interaction.commandName);
				if (cmd) {
					log({ author: username, text: `[command]:/${interaction.commandName} ${options}`.trim(), mode: 'chat', status: true });
					return cmd.execute(client, interaction);
				}
				const unknownCommand = new EmbedBuilder()
					.setDescription('Команда не найдена.').setColor('#FF4500');
				log({ author: username, text: `[command]:/${interaction.commandName} ${options}`.trim(), mode: 'chat' });
				await interaction.reply({ embeds: [unknownCommand], ephemeral: true });
			};
		}
		

    },
};