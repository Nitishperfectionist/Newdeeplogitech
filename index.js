const http = require('http');
const https = require('https');
const fs = require('fs');
const { JSDOM } = require('jsdom');


function fetchHTML(url) {
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
        }).on('error', (error) => {
            reject(error);
        });
    });
}

// Function to extract the latest stories from the HTML content using jsdom
function extractLatestStories(html) {
    const { document } = new JSDOM(html).window;
    const latestStories = [];
    const headlineElements = document.querySelectorAll('.headline');
    headlineElements.forEach((element) => {
        latestStories.push(element.textContent.trim());
    });
    return latestStories.slice(0, 6); 
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
