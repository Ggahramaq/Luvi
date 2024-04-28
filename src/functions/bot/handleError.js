const { ColorConsole: { gray, red } } = require('../../utils');

function handleError(client, err) {

    const today = new Date();
    const hours = today.getHours().toString().padStart(2, '0');
    const minutes = today.getMinutes().toString().padStart(2, '0');
    const seconds = today.getSeconds().toString().padStart(2, '0');

    const logMessage = gray(`[${hours}:${minutes}:${seconds}] `, -30);

    const stack = err.stack;
    const match = stack.match(/at\s+(.*)\s+\((.*):(\d+):(\d+)\)/);

    if (match) {
        const fileName = match[2];
        const lineNumber = match[3];

        const filePath = fileName.replace(`${__dirname}\\`, '');
        console.error(logMessage + `[${client.user.tag}] ${gray('>>>')} ошибка на строке: ${lineNumber}`);
        console.error(logMessage + `Ошибка в файле ${red(filePath)}`);
    }
    console.log(err)
}

module.exports = handleError;