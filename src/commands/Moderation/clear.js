const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const REGEXES = Object.freeze({
    "месяц": /(?:[мm][оo][нn][тt][h](?:[сsc]|)|[мm][оo](?:[yn]|)|[мm][еe][сsc](?:[я][ц](?:[ы]|)|))/gi,
    "неделя": /(?:[w][еe][еe][кk](?:[сsc]|)|[w]|[нn][еe][дd](?:[еe][лl](?:[иi]|[я]|[ь])|))/gi,
    "день": /(?:[дd][аa][уyu](?:[сsc]|))|(?:[дd][еe][нn][ь])|(?:[дd][нn][еe][й])|(?:[дd][нn][иi])|(?:[дd][нn][я])|[дd]/gi,
    "час": /(?:[h](?:(?:[оo][уyu][r](?:[сsc]|)|[r]|)))|(?:[ч](?:[аa][сsc](?:[ы]|[аa]|[оo][вv]|)|))/gi,
    "мин": /(?:[мm][иi][нn](?:[уyu][тt](?:|[ee](?:[сsc]|)|(?:[ы]|[аa]|[yn]))|))|(?:[мm])/gi,
    "сек": /(?:[сsc](?:[еe][кk](?:(?:[уyu][нn][дd](?:(?:[аa]|[ы])|))|)|))|(?:[sc](?:[ee][sc](?:(?:[оo][нn][дd](?:(?:[сsc])|))|)|))/gi,
});

const DURATIONS = Object.freeze({
    "месяц": 2592000, "неделя": 604800,
    "день": 86400, "час": 3600,
    "мин": 60, "сек": 1
});

function getDuration(input) {
    for (const [name, regex] of Object.entries(REGEXES)) {
        const result = input.replace(regex, name);
        if (result !== name) continue;
        return name;
    }
    return null;
}

function extractAmountAndDuration(word) {
    if (typeof word !== 'string' || !word.match(/\d+/)) {
        return { amount: undefined, duration: undefined };
    };

    const amount = word.match(/\d+/)[0];

    const duration = getDuration(word.replace(/\d/g, '').trim());
    return { amount, duration };
}

function calculateDuration(word) {
    if (!word) return false;

    const { amount, duration } = extractAmountAndDuration(word);
    if (!amount || !duration) return false;

    const durationInSeconds = DURATIONS[duration] * amount;

    return durationInSeconds;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Очистит последние сообщения в текущем канале или определённого участника.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addNumberOption(option =>
            option
                .setName('количество')
                .setDescription('Количество последних сообщений для обработки')),
    async execute(client, interaction) {
        const { options } = interaction;

        if (options._hoistedOptions.length) {
            const values = {
                'количество': 0,
                'длительность': 0,
                'участник': false,
            };

            options._hoistedOptions.forEach(e => {
                values[e.name] = e.value
            });

            const targetUser = values['участник'];
            const itemCount = values['количество'];
            const durationValue = values['длительность'];

            if (durationValue) {
                durationAmount = calculateDuration(durationValue);

                if (!durationAmount && durationAmount !== 0) {
                    const finishEmbed = new EmbedBuilder()
                        .setDescription('Некорректно указана длительность.')
                        .setColor('#3498db');
                    return await interaction.reply({ embeds: [finishEmbed], ephemeral: true });
                };
            }

            const messages = await interaction.channel.messages.fetch({ limit: 100 });

            if (targetUser) {
                messages.filter(({ author }) => author.id === targetUser);

            
            }
            

            const messagesToDelete = itemCount >= messages.size || itemCount == 0 ? messages.size : itemCount;

            if (!messages.size) {
                const finishEmbed = new EmbedBuilder()
                    .setDescription('Сообщений для удаления не найдено.')
                    .setColor('#3498db');
                return await interaction.reply({ embeds: [finishEmbed], ephemeral: true });
            }

            const deleteMessageEmbed = new EmbedBuilder()
                .setDescription('Удаление сообщений...')
                .setColor('#3498db');
            const deleteMessage = await interaction.reply({ embeds: [deleteMessageEmbed] });

            let messagesToDeleteCount = 0;

            for (const message of messages.values()) {
                if (messagesToDelete == 0 || messagesToDeleteCount < messagesToDelete) {
                    await message.delete();
                    messagesToDeleteCount++;

                    const deleteMessageEmbed = new EmbedBuilder()
                        .setDescription(`Удаление сообщений ${messagesToDeleteCount}/${messagesToDelete}`).setColor('#3498db');

                    await deleteMessage.edit({ embeds: [deleteMessageEmbed], ephemeral: true });
                }
            }

            const finishEmbed = new EmbedBuilder()
                .setDescription(`Удалено сообщений: ${messagesToDeleteCount}`)
                .setColor('#3498db');

            await deleteMessage.edit({ embeds: [finishEmbed], ephemeral: true });
        } else {
            const helpEmbed = new EmbedBuilder()
                .setDescription('Очистит последние сообщения в текущем канале или последние сообщения указанного участника.')
                .addFields(
                    { name: '**Пример 1:**', value: 'Удалить последние 100 сообщений в этом чате.\n`/clear 100`', inline: false },
                    { name: '**Пример 2:**', value: 'Удалить сообщения за последние 10 минут в этом чате.\n`/clear 10мин`', inline: false },
                    { name: '**Пример 3:**', value: 'Удалить до 100 сообщений выбранного участника в этом чате.\n`/clear @⁣Участник 100`', inline: false },
                    { name: '**Пример 4:**', value: 'Удалить сообщения выбранного участника за последние 10 минут в этом чате.\n`/clear @⁣Участник 10мин`', inline: false },
                ).setColor('#3498db')
                .setFooter({ text: 'Бот не может удалять сообщения старше 2 недель.' });
            return await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
        }
    }
};
