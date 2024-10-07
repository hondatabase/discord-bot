const fs   = require('fs').promises;
const path = require('path');

const fileName = path.basename(__filename, '.js');
const log = message => console.log(`[${fileName}] ${message}`);

module.exports = async channel => {
    const filePath = path.join(__dirname, '..', 'data', 'articles.json');
    
    try {
        const data     = await fs.readFile(filePath, 'utf8');
        const articles = JSON.parse(data);
        const saveArticles = async () => await fs.writeFile(filePath, JSON.stringify(articles, null, 2));

        for (const article of articles) {
            if (article.active !== true) continue; // Skip inactive articles

            const articleRequest = `'${article.description}' (${article.id})`;

            try {
                const message   = await channel.messages.fetch(article.id);
                const collector = message.createReactionCollector({ filter: (reaction, user) => reaction.emoji.name === '👍' && !user.bot });

                collector.on('collect', async reaction => {
                    log(`Collected reaction for ${reaction.message.id}`);
                    article.likes = reaction.count;
                    saveArticles();
                });

                collector.on('remove', async reaction => {
                    log(`Removed reaction for ${reaction.message.id}`);
                    article.likes = reaction.count;
                    saveArticles();
                });

                log(`Created collector for article request ${articleRequest}`);
            } catch (error) {
                // Set article to inactive status if the message is not found, so we don't try to collect reactions for it again
                article.active = false;
                saveArticles();

                log(`Set article request ${articleRequest} to inactive`);
            }
        }
    } catch (error) {
        console.error('Error reading article requests:', error);
    }
};
