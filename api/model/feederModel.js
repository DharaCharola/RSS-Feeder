import mongoose, { Schema } from 'mongoose'

let FeederSchema = new Schema(
  {
    url: {
      type: String,
      required: 'Feed URL required',
    },
    fontSize: {
      type: String,
      required: 'Font size required',
    },
    backColor: {
      type: String,
      required: 'Background color required',
    },
    textColor: {
      type: String,
      required: 'Font color required',
    },
    headlineColor: {
      type: String,
      required: 'Header color required',
    },
  },
  {
    collection: 'feeder',
  }
)

export default mongoose.model('Feeder', FeederSchema)
