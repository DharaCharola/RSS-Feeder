const express = require('express')
const app = express()
const port = 8000
const https = require('https')
const xml2js = require('xml2js')
const cors = require('cors')
const parser = new xml2js.Parser({ attrkey: 'ATTR' })

const server = app.listen(port)

server.timeout = 1000 * 60 * 10 // 10 minutes
app.use(
  cors({
    origin: '*',
  })
)

app.get('/api/test', (req, res) => res.send({}))

app.get('/api/getRssFeeds', (req, res) => {
  console.log(req)
  let testData = https.get('https://www.techuz.com/blog/feed/', finres => {
    let data = ''
    finres.on('data', stream => {
      data += stream
    })
    finres.on('end', () => {
      parser.parseString(data, (error, result) => {
        if (error === null && result && result.rss && result.rss.channel) {
          res.send(result.rss.channel[0].item)
        } else {
          console.log(error, 'error')
        }
      })
    })
  })
})
