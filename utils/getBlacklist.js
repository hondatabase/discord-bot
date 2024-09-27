const fs = require('fs').promises;
const path = require('path');

module.exports = async () => {
    const blacklistPath = path.join(__dirname, '..', 'data', 'blacklist.json');
    try {
        const data = await fs.readFile(blacklistPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.writeFile(blacklistPath, JSON.stringify({}), 'utf8');
            return {};
        }
        console.error('Error reading blacklist:', error);
        return {};
    }
};