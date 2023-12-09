require('dotenv').config()
const express = require('express');
const app = express();
const morgan = require('morgan')
const cors = require('cors')
const Record = require('./models/person')

app.use(cors())

app.use(express.json())
app.use(express.static('dist'))
app.use(morgan('tiny'))

let persons = [
   {
      id: 1,
      name: 'Arto Hellas',
      number: '040-123456',
   },
   {
      id: 2,
      name: 'Ada Lovelace',
      number: '39-44-5323523',
   },
   {
      id: 3,
      name: 'Dan Abramov',
      number: '12-43-234345',
   },
   {
      id: 4,
      name: 'Mary Poppendieck',
      number: '39-23-6423122',
   },
];

app.get('/', (request, response) => {
   response.send('<h1>Hello World!</h1>');
});

app.get('/info', (request, response) => {
   const people = persons.length;
   const datetime = new Date();
   response.send(
      `<p>Phonebook has info for ${people} people</p><p>${datetime}</p`
   );
});

app.get('/api/persons', (request, response) => {
   Record.find({}).then(result => {
      response.json(result)
   })
});

app.get('/api/persons/:id', (request, response) => {
   const id = Number(request.params.id);
   const person = persons.find((person) => person.id === id);

   if (person) {
      response.json(person)
   } else {
      response.status(404).end()
   }
});

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

const PORT = process.env.PORT;
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});
