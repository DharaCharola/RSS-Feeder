import {
  addFeeder,
  getFeeders,
  fetchFeeds,
  getFeedData,
} from '../controller/feederController'

const routes = app => {
  app
    .route('/feeder')
    .get(getFeeders)
    .post(addFeeder)
  app.route('/feeder/:id').get(getFeedData)
  app.route('/fetch-feeds').post(fetchFeeds)
}

export default routes
