const { Hangman } = require('discord-gamecord');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('hangman')
    .setDescription(`Начинает игру "Виселица"`),
    async execute(client, interaction) {
        
        const words = ['tree', 'cat', 'racoon', 'dog', 'beaver', 'bicycle', 'tomato', 'potato', 'bank', 'river', 'sunset', 'vampire', 'culture', 'history', 'landmark', 'video', 'game', 'pizza', 'sushi', 'keyboard', 'zombie', 'thriller', 'ghost', 'continent', 'action', 'mountain',];
        const wordRandom = Math.floor(Math.random() * words.length);

        const Game = new Hangman({
            message: interaction,
            isSlashGame: true,
            embed: {
                title: 'Виселица',
                color: '#5865F2',
            },
            hangman: { hat: '🎩', head: '😎', shirt: '👕', pants: '🩳', boots: '👞👞'},
            customWord: words[wordRandom],
            timeoutTimeL: 60000,
            theme: 'winter',
            winMessage: `<:icons_Correct:1187790923069915166> Вы выйграли! Слово было **{word}**`,
            loseMessage: `<:icons_Wrong:1187788186005536798> Вы проиграли! Слово было **{word}**`,
            playerOnlyMessage: `<:icons_Wrong:1187788186005536798> Только {player} может использовать кнопки`,
        });
        Game.startGame();
        Game.on('gameOver', result => {
            return;
        })
    }
}