const fs   = require('fs').promises;
const path = require('path');

module.exports = async channel => {
    const filePath = path.join(__dirname, '..', 'data', 'articles.json');

    try {
        const data     = await fs.readFile(filePath, 'utf8');
        const articles = JSON.parse(data);

        for (const article of articles) {
            try {
                const message   = await channel.messages.fetch(article.id);
                const collector = message.createReactionCollector({ filter: (reaction, user) => reaction.emoji.name === '👍' && !user.bot });

                collector.on('collect', async reaction => {
                    console.log(`Collected reaction: ${reaction.message.id}`);
                    article.likes = reaction.count;
                    await fs.writeFile(filePath, JSON.stringify(articles, null, 2));
                });

                collector.on('remove', async reaction => {
                    console.log(`Removed reaction: ${reaction.message.id}`);
                    article.likes = reaction.count;
                    await fs.writeFile(filePath, JSON.stringify(articles, null, 2));
                });

                console.log(`Created collector for article ${article.id}`);
            } catch (error) {
                console.error(`Error setting up collector for article ${article.id}:`, error);
            }
        }
    } catch (error) {
        console.error('Error reading article requests:', error);
    }
};
