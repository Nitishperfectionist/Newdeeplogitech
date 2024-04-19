
const https = require("https");

const resultarray = [];

const url = "https://time.com/";

https.get(url, (res) => {
  let body = '';

  res.on('data', (datarecieve) => {
    body += datarecieve;
  });

  res.on('end', () => {
    processHtmlData(body);
  });
}).on('error', (err) => {
  console.error("Error making HTTP request:", err);
});

function escapeBackslashes(input) {
  return input.replace(/\\(.)/g, '\\');
}
// this Function will escape the Backlashes 
//before any character for example if the input is "http://ab\\\cdef.com"; 
//the output after running the function is http://ab\cdef.com

function processHtmlData(htmlContent) {

  const data_required = htmlContent.split('<li class="latest-stories__item">');

  for (let i = 1; i <= 6; i++) {
    const answer_part = data_required[i];
    const data_part = answer_part.split(/(?<!\\)"/);
    const link = "https://time.com" + data_part[1];// Extract link 
    const title = data_part[4].split(/(?<!\\)>/)[1].split(/(?<!\\)<\/h3/)[0]; // Extract title 
    escapeBackslashes(link);
    escapeBackslashes(title);
    resultarray.push({ title, link });
  }
}

// Creating a server 
const http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  const url = req.url;
  if (url === '/getTimeStories') {
    res.write(JSON.stringify(resultarray));
    res.end();
  }
}).listen(8000, function () {
    console.log("server listening at port 8000");
  });
  





