const { Client, Collection, Partials, ActivityType} = require('discord.js');
const config = require('./src/config.json');
const log = require('./src/utils/log');
const loadCommands = require('./src/loader/loadCommands');
const loadEvents = require('./src/loader/loadEvents');
const { handleError } = require('./src/functions');


const mongoose = require('mongoose');
const client = new Client({
    intents: 3276799,
    partials: [Partials]
});
client.buttons = new Collection();
client.commands = new Collection();
client.modals = new Collection();
async function loadAll(client) {
    const commandsPromise = loadCommands(client);
    const eventsPromise = loadEvents(client);
    await Promise.all([commandsPromise, eventsPromise]);

    log({ text: 'Команды и события были загружены.' });
}

async function setBotPresence(client) {
    try {
        const activityName = 'Hello World!';
  
        await client.user.setPresence({
            activities: [{ name: activityName, type:ActivityType.Watching}],
            status: 'idle'
        });
  
        log({ text: 'Статус бота обновлен.' });
    } catch (error) {
        console.error('Ошибка при обновлении статуса бота:', error);
    }
}

client.on('ready', async () => {
    const { user: { username } } = client;
    log({ text: `Бот запущен` });
    log({ text: `Никнейм: ${username}` });
    log({ text: `ID: ${client.user.id}` });
    await loadAll(client);
    await setBotPresence(client);

    

    try {
        if (!config.mongoURL) throw new Error('Отсутствует URL MongoDB!');
        mongoose.set('strictQuery', true);
        await mongoose.connect(config.mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        

        log({ text: `Подключились к MongoDB!`});
    } catch (error) {
        console.error('Ошибка подключения к MongoDB:', error.message);
    }

    
});

client.on('error', (err) => {
    handleError(client, err);
});


const { welCard } = require("welcard");
client.on('guildMemberAdd', async newMember => {
    try {
        const { user: newMemberUser, guild } = newMember;
        const nickname = newMemberUser.nickname || newMemberUser.username;
        const useravatar = newMemberUser.displayAvatarURL({ size: 512 });
        const card = new welCard()
            .setAbout("")
            .setName("Welcome!")
            .setAuthor(nickname)    
            .setServer(`Участников на сервере: ${guild.memberCount}.`)
            .setColor("auto")
            .setBrightness(50)
            .setThumbnail(useravatar);
       
        const cardBuffer = await card.build();

        try {
            const channel = newMember.guild.channels.resolve(config.Welcomelogschannel);
            if (channel) {
                await channel.send({
                    files: [{
                        attachment: cardBuffer,
                        name: 'welcome-image.png'
                    }]
                });
            } else {
                console.log('Канал не найден.');
            }
        } catch (error) {
            console.error(`Ошибка при отправке фото: ${error}`);
        }
    } catch (error) {
        console.error(`Ошибка при загрузке фото: ${error}`);
    }
});


client.on('guildMemberRemove', async newMember => {
    try {
        const { user: newMemberUser, guild } = newMember;
        const nickname = newMemberUser.nickname || newMemberUser.username;
        const useravatar = newMemberUser.displayAvatarURL({ size: 512 });
        const card = new welCard()
            .setAbout("")
            .setName("Good bye :(")
            .setAuthor(nickname)    
            .setServer(`Участников на сервере: ${guild.memberCount}.`)
            .setColor("auto")
            .setBrightness(50)
            .setThumbnail(useravatar);
       
        const cardBuffer = await card.build();

        try {
            const channel = newMember.guild.channels.resolve(config.Goodbyelogschannel);
            if (channel) {
                await channel.send({
                    files: [{
                        attachment: cardBuffer,
                        name: 'goodbye-image.png'
                    }]
                });
            } else {
                console.log('Канал не найден.');
            }
        } catch (error) {
            console.error(`Ошибка при отправке фото: ${error}`);
        }
    } catch (error) {
        console.error(`Ошибка при загрузке фото: ${error}`);
    }
});



client.login(config.token);
 