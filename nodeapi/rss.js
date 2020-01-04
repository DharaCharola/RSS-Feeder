const https = require('https');
const xml2js = require('xml2js');
const parser = new xml2js.Parser({ attrkey: "ATTR" });

let req = https.get("https://www.techuz.com/blog/feed/", (res) => {
    let data = '';
    res.on('data', (stream) => {
        data += stream;
    });
    res.on('end', () => {
        parser.parseString(data, (error, result) => {
            if(error === null) {
                console.log(result.rss.channel[0].item, 'success');
            }
            else {
                console.log(error, 'error');
            }
        });
    });
});