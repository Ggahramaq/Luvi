const colorCodes = require('./colorCodes');

function getRGB(text, brightness = 0, hexCode = null, rgb = null) {
    const { r, g, b } = hexCode
        ? [1, 3, 5].reduce((acc, cur, i) => ({ ...acc, [['r', 'g', 'b'][i]]: parseInt(hexCode.slice(cur, cur + 2), 16) }), {})
        : rgb;

    brightness = Math.min(Math.max(brightness, -100), 168);
    const multiplier = brightness / 100 + 1;

    const clamp = (value) => Math.round(Math.min(Math.max(value * multiplier, 0), 255));

    const rFinal = clamp(r);
    const gFinal = clamp(g);
    const bFinal = clamp(b);

    return `\x1b[38;2;${rFinal};${gFinal};${bFinal}m${text}\x1b[0m`;
}

function color(colorName) {
    const hexCode = colorCodes[colorName] || colorCodes.white;
    return function (text, brightness = 0) {
        return getRGB(text, brightness, hexCode);
    };
}

function colorByRgb(r, g, b) {
    return function (text, brightness = 0) {
        const rgb = { r, g, b };
        return getRGB(text, brightness, false, rgb);
    };
}

function colorByHex(hexCode) {
    return function (text, brightness = 0) {
        return getRGB(text, brightness, hexCode);
    };
}

const colors = {
    color,
    colorByRgb,
    colorByHex,
    ...Object.fromEntries(Object.entries(colorCodes).map(([key, value]) => [key, color(key)])),
    bold: (text, used = true) => used ? `\x1b[1m${text}\x1b[0m` : text,
    italic: (text, used = true) => used ? `\x1b[3m${text}\x1b[0m` : text,
    underline: (text, used = true) => used ? `\x1b[4m${text}\x1b[0m` : text,
    reset: (text, used = true) => used ? `\x1b[0m${text}\x1b[0m` : text,
    strike: (text, used = true) => used ? `\x1b[9m${text}\x1b[0m` : text,
    colors: Object.keys(colorCodes),
};

module.exports = colors;
