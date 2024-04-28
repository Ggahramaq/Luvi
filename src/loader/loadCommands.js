const path = require('path');
const { readdir } = require('fs').promises;
const log = require('../utils/log');

const commandsPath = './src/commands';

module.exports = async function loadCommands(client) {

    const slashCommands = client.application.commands;
    await slashCommands.fetch();

    const commandDirectories = await readdir(commandsPath);

    for (const dir of commandDirectories) {

        let index = 0;
        const dirPath = path.resolve(commandsPath, dir);

        const fileCommands = (await readdir(dirPath)).filter(file => file.endsWith('.js'));

        log({ text: `Загрузка slash команд из папки: ${dir}` });

        for (const file of fileCommands) {
            index++;
            const filePath = path.join(dirPath, file);

            try {
                command = require(filePath);
            } catch (err) {
                log({ text: `[${index}/${fileCommands.length}] Ошибка импорта пакета в файле команды: ${dir}/${file}\n[ERROR]: ${err}`, mode: 'error' });
                continue;
            }

            if ('data' in command && 'execute' in command) {
                if (command.execute.length != 2) {
                    log({ text: `[WARN] Возможны ошибки в вызове команды: ${dir}/${file}`, mode: 'loadCommands', status: 'warn' });
                }
                log({ text: `[${index}/${fileCommands.length}] Загружена slash команда: ${command.data.name}`, mode: 'loadCommands' });
                client.commands.set(command.data.name, command);
                slashCommands.create(command.data);
            } else {
                log({ text: `Ошибка загрузки файла команды: ${dir}/${file}`, mode: 'error' });
            }
        }
    }
};