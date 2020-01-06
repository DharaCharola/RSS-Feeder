import Feeder from '../model/feederModel'
import request from 'request'
import xml2js from 'xml2js'
const parser = new xml2js.Parser({ attrkey: 'ATTR' })

export function addFeeder(req, res) {
  let feeder = new Feeder(req.body)
  feeder.save((error, feederRes) => {
    if (error) {
      res.json(error)
    }
    res.json(feederRes)
  })
}

export function getFeeders(req, res) {
  Feeder.find({}, (error, feeders) => {
    if (error) {
      res.json(error)
    }
    res.json(feeders)
  })
}

export function fetchFeeds(req, res) {
  let feedUrl = req.body.feedUrl
  request.get(feedUrl, (error, response, finres) => {
    parser.parseString(finres, (error, result) => {
      if (error === null && result && result.rss && result.rss.channel) {
        res.send({
          link: result.rss.channel[0].link[0],
          list: result.rss.channel[0].item,
        })
      } else {
        console.log(error, 'error')
      }
    })
  })
}
