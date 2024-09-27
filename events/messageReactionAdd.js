const fs     = require('fs').promises;
const path   = require('path');
const { ARTICLE_REQUEST_CHANNEL_ID } = require('../config');

module.exports = {
    name: 'messageReactionAdd',
    execute: async (_, reaction, user) => {
        if (user.bot) return;

        // Check if it's a partial reaction
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.error('Error fetching reaction:', error);
                return;
            }
        }

        // Reactions in the Article Request channel
        if (reaction.message.channel.id === ARTICLE_REQUEST_CHANNEL_ID) {
            if (reaction.emoji.name === '👍') { // We only care about the like reaction
                const filePath = path.join(__dirname, '..', 'data', 'articles.json');
                try {
                    const data = await fs.readFile(filePath, 'utf8');
                    let articles = JSON.parse(data);

                    const article = articles.find(a => a.id === reaction.message.id);
                    if (article) {
                        article.likes = reaction.count;
                        await fs.writeFile(filePath, JSON.stringify(articles, null, 2));
                    }
                } catch (error) {
                    console.error('Error updating article likes:', error);
                }
            } else {
                try {
                    await reaction.remove();
                } catch (error) {
                    console.error('Error removing non-like reaction:', error);
                }
            }
        }
    }
};