const axios = require('axios');
const Vibrant = require('node-vibrant');

async function getColor(url) {
    return await axios.get(url, { responseType: 'arraybuffer' })
        .then(async response => {

            const imageBuffer = Buffer.from(response.data, 'binary');
            const color = await Vibrant.from(imageBuffer).getPalette();
            return color.LightMuted.hex;

        }).catch(error => error);
}

module.exports = getColor;