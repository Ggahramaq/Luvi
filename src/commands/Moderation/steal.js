const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');
const { default: axios } = require(`axios`);

module.exports = {

    data: new SlashCommandBuilder()
        .setName('copy')
        .setDescription('Копирует любой эмодзи с любого сервера!')
        .addStringOption(option => option.setName('emoji').setDescription('Выберите эмодзи который вы хотите добавить на сервер.').setRequired(true))
        .addStringOption(option => option.setName('name').setDescription('Выберите название эмодзи.').setRequired(true)),
    async execute(client, interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageEmojisAndStickers)) return await interaction.reply({ content: `Вы должны иметь право "Управлять эмодзи и стикеры" чтобы использовать эту команду.`, ephemeral: true });

        let emoji = interaction.options.getString(`emoji`)?.trim();
        const name = interaction.options.getString("name");

        if (emoji.startsWith("<") && emoji.endsWith(">")) {
            const id = emoji.split(':')[2].replace('>', '')

            const type = await axios.get(`https://cdn.discordapp.com/emojis/${id}.gif`)
                .then(image => {
                    if (image) return "gif"
                    else return "png"
                }).catch(err => {
                    return "png"
                })

            emoji = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`

        }

        if (!emoji.startsWith("http")) {
            return await interaction.reply({ content: "Вы не можете добавлять дефолтные эмодзи!" })
        }
        if (!emoji.startsWith("https")) {
            return await interaction.reply({ content: "Вы не можете добавлять дефолтные эмодзи!" })
        }

        interaction.guild.emojis.create({ attachment: `${emoji}`, name: `${name}` })
            .then(emoji => {
                const embed = new EmbedBuilder()
                    .setColor("Blue")
                    .setDescription(`Эмодзи ${emoji} был добавлен на сервер. Название эмодзи: ${name}`)
                    

                return interaction.reply({ embeds: [embed] });
            }).catch(err => {
                interaction.reply({ content: "Вы не можете добавлять эмодзи т.к. сервер привысил лимит эмодзи", ephemeral: true })
            })
    }
}