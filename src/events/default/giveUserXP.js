const User = require('../../Schemas/levelingSchema');

module.exports = {
    name: "messageCreate",
    async exec(client, message) {
        if (!message.author.bot) {
        const guildId = message.guild.id;
        const userId = message.author.id;

        if (message.author.bot || !message.guild) return;

        let user;

        try {
            user = await User.findOneAndUpdate(
                { guildId, userId },
                { guildId, userId },
                { upsert: true, new: true }
            );

            const XpAmount = Math.floor(Math.random() * (25 * user.level) + 12);

            user = await User.findOneAndUpdate(
                { guildId, userId },
                { guildId, userId, $inc: { xp: XpAmount } },
                { upsert: true, new: true }
            );

            let { xp, level } = user;

            if (xp >= (level * level * level * 25) + 20) {
                user = await User.findOneAndUpdate(
                    { guildId, userId },
                    { guildId, userId, $set: { level: level + 1 } }
                );
                
                message.reply(`Поздравляю! У <@${userId}> теперь **${level + 1} уровень!!**`);
            }
        } catch (e) {
            console.log(e);
            }
        }
    }
};
