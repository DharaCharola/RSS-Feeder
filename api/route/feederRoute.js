import {
  addFeeder,
  getFeeders,
  fetchFeeds,
} from '../controller/feederController'

const routes = app => {
  app
    .route('/feeder')
    .get(getFeeders)
    .post(addFeeder)
  app.route('/fetch-feeds').post(fetchFeeds)
}

export default routes
