const {SlashCommandBuilder, hyperlink, ChatInputCommandInteraction, EmbedBuilder, AttachmentBuilder} = require('discord.js');

const { MessageEmbed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Выдаст все заддержки которые имеет бот'),
        async execute (client, message) {
        let circles = {
            green: "🟢",
            yellow: "🟡",
            red: "🔴"
        }
        let days = Math.floor(client.uptime / 86400000)
        let hours = Math.floor(client.uptime / 3600000) % 24
        let minutes = Math.floor(client.uptime / 60000) % 60
        let seconds = Math.floor(client.uptime / 1000) % 60

        let botLatency = new Date() - message.createdAt
        let apiLatency = client.ws.ping;
      
      const pingEmbed = new EmbedBuilder()
        .setTitle("Задержка бота & Пинг бота")
        .setColor("Green")
        .setThumbnail(client.user.displayAvatarURL({ dynamic : true }))
        .addFields(
          { 
            name: "Задержка бота:", 
            value: `${botLatency <= 200 ? circles.green : botLatency <= 400 ? circles.yellow : circles.red} ${botLatency}ms`, 
            inline: true
          },
          { 
            name: "Задержка API:", 
            value: `${apiLatency <= 200 ? circles.yellow : apiLatency <= 400 ? circles.yellow : circles.red} ${apiLatency}ms`, 
            inline: true 
          },
          { 
            name: "Бот Онлайн:", 
            value: `${days}d ${hours}h ${minutes}m ${seconds}s`, inline: true 
          }
        )
        .setFooter({ text: ` • Requested by ${message.user.username}`, iconURL: client.user.displayAvatarURL() })
        .setTimestamp()
      
        return message.reply({ embeds: [pingEmbed], allowedMentions: { repliedUser: false } })
    },
}