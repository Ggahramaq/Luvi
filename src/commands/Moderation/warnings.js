const { SlashCommandBuilder } = require('discord.js');
const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const warningSchema = require('../../Schemas/warnSchema');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('warns')
        .setDescription('Покажет предупреждения любого пользователя!')
        .addUserOption(option => option.setName('пользователь').setDescription('Пользователь, у которого хотите посмотреть предупреждения.').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(client, interaction) {

        const { options, guild } = interaction;
        const target = options.getUser('пользователь');

        const embed = new EmbedBuilder();
        const noWarns = new EmbedBuilder();

        const data = await warningSchema.find({ GuildID: guild.id, UserID: target.id });
        if (data.length > 0) {
            const warnsInData = [];
            let index = 1;
            for (const value of data) {const {Content} = value;
            warnsInData.push(`
                        **🔢・Предупреждения:** ${index}
                        **📜・Причина:** ${Content[0].Reason}
            `);
            index++;
            }
            
            embed.setColor("Orange")
                .setDescription(`> 📜 **Предупреждения ${target.tag} :**
                ${warnsInData.join('\n')}`)

            interaction.reply({embeds: [embed]});
        } else {
            noWarns.setColor('Orange')
                .setDescription(`У ${target.username} 0 предупреждений!`);

            interaction.reply({ embeds: [noWarns] });
        }
        
    }
};
