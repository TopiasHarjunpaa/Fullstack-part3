const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const morgan = require('morgan')
const Person = require('./models/person')

morgan.token('body', function (request, response) {
  if (request.method === 'POST') {
    return JSON.stringify(request.body)
  }
})

app.use(express.json())
app.use(cors())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
  console.log('Info page')
  Person.find({}).then(persons => {
    const personsInfo = `Phonebook has info for ${persons.length} people`
    const date = new Date().toString()
    response.send(`<p>${personsInfo}</p> ${date}`)
  })
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if(!body.name === undefined) {
    return response.status(400).json({
      error: 'name is missing'
    })
  } else if (!body.number) {
    return response.status(400).json({
      error: 'number is missing'
    })        
  } else { 
    const person = new Person({
      name: body.name,
      number: body.number,
    })
    person.save().then(savedPerson => {
      response.json(savedPerson)
      console.log('Person added')
    })
  }
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    console.log('Finding persons')
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = Number(request.params.id)
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        console.log(`person ${person.name} found`)
        response.json(person)
      } else {
        console.log('person not found')
        response.status(404).end()        
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true})
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT), () => {
  console.log(`Server running on port ${PORT}`)
}