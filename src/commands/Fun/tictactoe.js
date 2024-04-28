const { TicTacToe } = require('discord-gamecord');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('tic-tac-toe')
    .setDescription(`Начинает игру 'Крестики нолики'`)
    .addUserOption(option => option
        .setName('участник')
        .setDescription('Участник сервера с которым вы хотите сыграть.')
        .setRequired(true)),
    async execute(client, interaction) {
        const Game = new TicTacToe({
            message: interaction,
            isSlashGame: false,
            opponent: interaction.options.getUser('участник'),
            embed: {
              title: 'Крестики нолики',
              color: '#5865F2',
              statusTitle: 'Статус:',
              overTitle: 'Игра окончена'
            },
            emojis: {
              xButton: '<:icons_Wrong:1187788186005536798>',
              oButton: '<:icons_dblurple:1187788866632024205>',
              blankButton: '➖'
            },
            mentionUser: true,
            timeoutTime: 60000,
            xButtonStyle: 'DANGER',
            oButtonStyle: 'PRIMARY',
            turnMessage: '{emoji} | Щас ход **{player}**.',
            winMessage: '{emoji} | **{player}** выйграл игру крестики нолики.',
            tieMessage: ':handshake: Произошла ничья! Никто не выйграл!',
            timeoutMessage: '<:icons_Wrong:1187788186005536798> Игра была незавершена! Никто не выйграл игру!',
            playerOnlyMessage: '<:icons_Wrong:1187788186005536798> Только {player} и {opponent} могут использовать кнопки.'
          });

          Game.startGame();
      Game.on('gameOver', result => {
        return; 
      });
    }
    
      
}