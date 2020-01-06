import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cors from 'cors'
import config from './DB'
import routes from './route/feederRoute'
const app = express()
const PORT = 4000

mongoose.Promise = global.Promise
mongoose
  .connect(config.DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(
    () => {
      console.log('Database is connected')
    },
    err => {
      console.log('Can not connect to the database' + err)
    }
  )
app.use(express.static('./public'))
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
routes(app)
app.listen(PORT, () => {
  console.log('Server is running on Port:', PORT)
})
