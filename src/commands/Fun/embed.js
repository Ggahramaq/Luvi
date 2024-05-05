const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder} = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
    .setDMPermission(false)
    .setName('embed')
    .setDescription('Создайте эмбед!')
    .addStringOption(option => option.setName('title').setDescription('Добавьте титл вашему эмбеду').setRequired(true))
    .addStringOption(option => option.setName('description').setDescription('Добавьте описание вашему эмбеду').setRequired(true))
    .addBooleanOption(option => option.setName('timestamp').setDescription('Добавьте таймстамп вашему эмбеду').setRequired(true))
    .addStringOption(option => option.setName('color').setDescription('(HEX) Добавьте цвет вашему эмбеду (Дефолтный: Белый)').setMaxLength(6).setMinLength(6).setRequired(false))
    .addStringOption(option => option.setName('thumbnail').setDescription('Добавьте тамбнейл вашему эмбеду').setRequired(false))
    .addStringOption(option => option.setName('fieldname').setDescription('Добавьте фиелд к вашему эмбеду(учтите добавить еще значение)').setRequired(false))
    .addStringOption(option => option.setName('fieldvalue').setDescription('Добавьте значение фиелду для эмбеда').setRequired(false))
    .addStringOption(option => option.setName('footer').setDescription('Добавьте футер к вашему эмбеду').setRequired(false)),
 
    async execute (client, interaction) {
        
        const op = interaction.options
 
        const title = op.getString('title');
        const description = op.getString('description');
        const timestamp = op.getBoolean('timestamp');
        const footer = op.getString('footer')
        const color = op.getString('color');
        const thumbnail = op.getString('thumbnail');
        let fieldname = op.getString('fieldname');
        let fieldValue = op.getString('fieldvalue');
        
    try {
        const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor('White')
        
        if(fieldname != null || fieldValue != null) {
            if (fieldname == null) fieldname = 'No input here :(';
            if (fieldValue == null) fieldValue = 'No input here :(';
            embed.addFields(
                { name: `${fieldname}`, value: `${fieldValue}`}
                )
        }
        
        if(timestamp == true) {
            embed.setTimestamp()
        }
        if(footer) {
            embed.setFooter({ text: footer})
        }
        if(color) { 
            embed.setColor(`#${color}`)
        }
        if(thumbnail) {
            embed.setThumbnail(thumbnail)
        }
        await interaction.reply({ content: 'Эмбед был отправлен успешно!', ephemeral: true})
        await interaction.channel.send({ embeds: [embed] }) 
    } catch (err) {
        const embed = new EmbedBuilder()
        .setColor('White')
        .setTitle('Error')
        .setDescription("Произошла ошибка во время добавления эмбеда")
        await interaction.reply({ embeds: [embed], ephemeral: true})
    }
        }
    }
