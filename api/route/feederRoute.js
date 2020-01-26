import {
  addFeeder,
  getFeeders,
  fetchFeeds,
  getFeedData,
} from '../controller/feederController'

const routes = app => {
  app
    .route('/api/feeder')
    .get(getFeeders)
    .post(addFeeder)
  app.route('/api/feeder/:id').get(getFeedData)
  app.route('/api/fetch-feeds').post(fetchFeeds)
}

export default routes
