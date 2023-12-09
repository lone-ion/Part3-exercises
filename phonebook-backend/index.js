require('dotenv').config()
const express = require('express');
const app = express();
const morgan = require('morgan')
const Record = require('./models/person')

app.use(express.json())
app.use(express.static('dist'))
app.use(morgan('tiny'))

app.get('/api/persons', (request, response) => {
   Record.find({}).then(result => {
      response.json(result)
   })
});

app.get('/api/persons/:id', (request, response, next) => {
   Record.findById(request.params.id)
      .then(result => {

         if (result) {
            response.json(result)
         } else {
            response.status(404).end()
         }
      })
      .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
   Record.findByIdAndDelete(request.params.id)
      .then(result => {
         response.status(204).end()
      })
      .catch(error => next(error))
   })

app.post('/api/persons', (request, response) => {
   const person = request.body

   const record = new Record({
      name: person.name,
      number: person.number,
   })

   record.save().then(() => {
      console.log('record saved!')
   })

})

const unknownEndpoint = (request, response) => {
   response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
   console.error(error.message)

   if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
   }

   next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT;
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});
