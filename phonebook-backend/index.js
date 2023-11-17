const express = require('express');
const app = express();
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())

app.use(express.json())
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
   response.json(persons);
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
   const id = Number(request.params.id)
   persons = persons.filter(person => person.id !== id)

   response.status(204).end()
})

const generateId = () => {
   const newId = Math.floor(Math.random() * 1000000000)
   return newId
}

app.post('/api/persons', (request, response) => {
   const person = request.body
   
   if (!person.name) {
      return response.status(400).json({
         error: 'name is missing'
      })
   }

   if (!person.number) {
      return response.status(400).json({
         error: 'number is missing'
      })
   }

   const exists = persons.filter(elem => elem.name === person.name)
   
   if ( exists.length > 0 ) {
      return response.status(400).json({
         error: 'name must be unique'
      })
   }

   person.id = generateId()

   persons = persons.concat(person)

   response.json(person)
})

const PORT = 3001;
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});
