const Hapi = require('@hapi/hapi');
const Parser = require('rss-parser');
const { htmlToText } = require('html-to-text'); // Import library

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

                const newsList = feed.items.map(item => {
                    let imageUrl = null;

                    // Cek apakah ada tag <media:content>
                    if (item['media:content'] && item['media:content']['$'] && item['media:content']['$'].url) {
                        imageUrl = item['media:content']['$'].url;
                    } 
                    // Jika tidak ada, cek tag <enclosure>
                    else if (item.enclosure && item.enclosure.url) {
                        imageUrl = item.enclosure.url;
                    }

                    // Menggunakan contentSnippet jika content tidak ada
                    const content = item.content || item.contentSnippet || item.description;

                    // Menggunakan htmlToText untuk membersihkan tag HTML
                    let cleanedContent = htmlToText(content, {
                        wordwrap: 130
                    });

                    // Menghapus URL gambar dari deskripsi dengan regex
                    cleanedContent = cleanedContent.replace(/https?:\/\/[^\s]+(?:jpg|jpeg|png|gif|bmp|webp)/g, '');

                    // Menghapus "[]" dan "\n\n" jika ada
                    cleanedContent = cleanedContent.replace(/\[\]\s*\n\n/g, '');

                    return {
                        title: item.title,
                        description: cleanedContent, // Menampilkan deskripsi yang sudah dibersihkan
                        link: item.link,
                        published: item.pubDate,
                        imageUrl: imageUrl
                    };
                }).filter(item => {
                    // Cek apakah title dan content ada sebelum melakukan toUpperCase
                    const title = item.title || '';
                    const content = item.description || '';

                    return title.toUpperCase().includes(symbol.toUpperCase()) ||
                           content.toUpperCase().includes(symbol.toUpperCase());
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
