const path = require('path');
const { readdir } = require('fs').promises;
const log = require('../utils/log');

const eventsPath = './src/events';

module.exports = async function loadEvents(client) {

    const eventFolders = await readdir(eventsPath);

    for (const folder of eventFolders) {

        let index = 0;
        const eventFolderPath = path.join(eventsPath, folder);
        const eventFiles = (await readdir(eventFolderPath)).filter(file => file.endsWith('.js'));

        log({ text: `Загрузка ивентов из папки: ${folder}` });

        for (const file of eventFiles) {
            index++;
            const eventName = file.slice(0, -3);
            const eventPath = path.resolve(eventFolderPath, file);

            try {
                const event = require(eventPath);
                client.on(event.name || eventName, async (...args) => {
                    return await event.exec(client, ...args);
                });
                log({ text: `[${index}/${eventFiles.length}] Загружен ивент: ${eventName}`, mode: 'loadEvents' });
            } catch (err) {
                log({ text: `[${index}/${eventFiles.length}] Ошибка импорта пакета в файле ивента: ${folder}/${file}\n[ERROR]: ${err}`, mode: 'error' });
                continue;
            }
        }
    }
}