const { SlashCommandBuilder} = require ('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('emoji-list')
        .setDescription('Покажет все эмодзи которые есть на сервере.'),

    async execute(client, interaction) {
        const emojis = await interaction.guild.emojis.fetch().catch(() => { });
        if (!emojis) return await interaction.reply({ content: 'На сервере нету эмодзи!', ephemeral: true });

        const emojiArray = emojis.map(emoji => {
            const emojiText = `<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}>`;
            return `${emojiText} - \\${emojiText}`;
        });

        const emojiChunks = chunkArray(emojiArray, 100);

        const embeds = [];

        for (const chunk of emojiChunks) {
            const embed = {
                description: chunk.join('\n'),
                color: 0x3498db
            };
            embeds.push(embed);
        }

        interaction.reply({ embeds: [embeds.pop()] });

        for (const embed of embeds) {
            interaction.followUp({ embeds: [embed] });
        }
        
    }
};

function chunkArray(array, chunkSize) {
    if (!Array.isArray(array)) throw new TypeError('Array must be an array!');
    if (typeof chunkSize !== 'number') throw new TypeError('Chunk size must be a number!');

    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
}
