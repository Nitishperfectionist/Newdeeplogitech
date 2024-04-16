const http = require('http');
const https = require('https');
const fs = require('fs');

// Function to make a GET request to a given URL
async function fetchHTML(url) {
    const protocolHandler = url.startsWith('https') ? https : http;

    return new Promise((resolve, reject) => {
        protocolHandler.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                resolve(data);
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

// Function to extract the latest stories from the HTML content
function extractLatestStories(html) {
    const headlinePattern = /<h3 class="headline">(.*?)<\/h3>/g;
    const latestStories = [];
    let match;

    while ((match = headlinePattern.exec(html)) !== null && latestStories.length < 6) {
        latestStories.push(match[1].trim());
    }

    return latestStories;
}

// Create a simple Node.js server
const server = http.createServer(async (req, res) => {
    if (req.url === '/latest-stories') {
        try {
            const html = await fetchHTML('https://time.com');
            const latestStories = extractLatestStories(html);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(latestStories));
        } catch (error) {
            console.error('Error fetching or parsing HTML:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error fetching or parsing HTML');
        }
    } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.createReadStream('./index.html').pipe(res);
    }
});

const PORT = 5050;
server.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});
