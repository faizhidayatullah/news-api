const Hapi = require('@hapi/hapi');
const Parser = require('rss-parser');

(async () => {
    const port = process.env.PORT || 8080;
  const server = Hapi.server({
    port: port,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route({
    method: 'GET',
    path: '/news/{symbol}',
    handler: async (request, h) => {
      const symbol = request.params.symbol;
      const url = "https://cointelegraph.com/rss";

      try {
        const parser = new Parser();
        const feed = await parser.parseURL(url);

        const newsList = feed.items.filter(item => {
          return item.title.toUpperCase().includes(symbol.toUpperCase()) ||
            item.content.toUpperCase().includes(symbol.toUpperCase());
        }).map(item => {
          return {
            title: item.title,
            description: item.contentSnippet,
            link: item.link,
            published: item.pubDate,
          };
        });

        return newsList;
      } catch (error) {
        console.error("Failed to fetch news:", error);
        return h.response({ error: "Failed to fetch news" }).code(500);
      }
    }
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
})();