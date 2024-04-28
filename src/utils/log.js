const { gray, purple, aqua, red, green, yellow, cornsilk, coral, dark_red, emerald, peach, peach_puff, dark_aqua, dark_khaki, bold, blue, italic } = require('./ColorConsole/ColorConsole.js');

module.exports = function (data) {

    const today = new Date();
    const hours = today.getHours().toString().padStart(2, '0');
    const minutes = today.getMinutes().toString().padStart(2, '0');
    const seconds = today.getSeconds().toString().padStart(2, '0');

    const logMessage = gray(`[${hours}:${minutes}:${seconds}] `, -30);

    const { author, text, mode, status } = data;
    const loader = text.split(':');

    switch (mode) {
        case 'loadCommands':
            if (status) {
                return console.log(logMessage + yellow(loader[0] + ':', -15) + gray(loader[1], -10));
            }
            return console.log(logMessage + purple(loader[0] + ':', -5) + gray(loader[1], -10));
        case 'loadButtons':
            if (status) {
                return console.log(logMessage + yellow(loader[0] + ':', -15) + gray(loader[1], -10));
            }
            return console.log(logMessage + dark_khaki(loader[0] + ':', -5) + gray(loader[1], -10));
        case 'loadModals':
            if (status) {
                return console.log(logMessage + yellow(loader[0] + ':', -15) + gray(loader[1], -10));
            }
            return console.log(logMessage + dark_aqua(loader[0] + ':', -5) + gray(loader[1], -10));
        case 'loadEvents':
            return console.log(logMessage + green(loader[0] + ':', -15) + gray(loader[1], -10));
        case 'chat':
            if (status) {
                return console.log(logMessage + purple(loader[0] + ' ', -5) + `${cornsilk(author)} ${emerald(text.replace(loader[0] + ':', ''), -5)}`);
            }
            return console.log(logMessage + purple(loader[0] + ' ', -5) + `${cornsilk(author)} ${coral(text.replace(loader[0] + ':', ''), -5)} ${dark_red('(Команду не удалось выполнить)')}`);
        case 'error':
            return console.log(logMessage + dark_red(loader[0] + ': ', -5) + `${coral(text.replace(loader[0] + ': ', ''), -10)}`);
        default:
            return console.log(logMessage + aqua(text, -5));
    }
}