const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url);

mongoose.connect(url).then(() => console.log('connected to MongoDB'))
   .catch(e => console.log(e.message));

const recordSchema = new mongoose.Schema({
   name: {
      type: String,
      minLength: 3
   },
   number: String,
})

recordSchema.set('toJSON', {
   transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
   }
})

module.exports = mongoose.model('Record', recordSchema)