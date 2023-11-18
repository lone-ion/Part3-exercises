const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.cqs0kus.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url).then(() => console.log('connected'))
  .catch(e => console.log(e));

const recordSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Record = mongoose.model('Record', recordSchema)

if (process.argv.length === 3) {
  Record.find({}).then(result => {
    result.forEach(record => {
      console.log(record)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length === 5) {
  const record = new Record({
    name: process.argv[3],
    number: process.argv[4],
  })

  record.save().then(result => {
    console.log('record saved!')
    mongoose.connection.close()
  })

}