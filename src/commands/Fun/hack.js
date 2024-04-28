const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('hack')
    .setDescription('Взломайте любого пользователя!')
    .addUserOption(option => option
        .setName('участник')
        .setDescription('Участник сервера с которым вы хотите сыграть.')
        .setRequired(true)),


  async execute (client, interaction) {

    let message= interaction

    let member = interaction.options.getUser('участник')
    if(!member) return message.reply("Упоменуйте кого-нибудь чтоб взломать.")
    message.reply("**[5%]** Ищем дискорд логин... [2х факторка пройденна!]").then(m => {
        setTimeout(() => {
            m.edit("**[15%]** Дискорд логин найден, Ищем айпи..").then(m2 => {
                setTimeout(() => {
                    m2.edit("**[30%]** Айпи найден! Ищем почту и пароль..").then(m3 => {
                        setTimeout(() => {
                            m3.edit(`**[50%]** Почта найденна! Почта: ${member.username}@gmail.com｜Пароль: **XuIsjgi9cg_**`).then(m4 => {
                                setTimeout(() => {
                                    m4.edit("**[75%]** Скачиваем троян....").then(m5 => {
                                        setTimeout(() => {
                                            m5.edit(`**[100%]** Взлом ${member} завершен!`).then(m6 => {
                                                setTimeout(() => {
                                                    m6.edit(`Вы успешно взломали ${member} :}`)
                                                }, 2100);
                                            })
                                        }, 4000);
                                    })
                                }, 1800);
                            })
                        }, 3100);
                    })
                }, 3200);
            })
        }, 2100);
    })


  }

}