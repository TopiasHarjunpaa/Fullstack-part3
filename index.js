require('dotenv').config()
const { response, request } = require('express')
const express = require('express')
const req = require('express/lib/request')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')

morgan.token('body', function (req, res) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
})

app.use(express.json())
app.use(express.static('build'))
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/', (request, response) => {
  response.send('<h1>Nothing</h1>')
})

app.get('/info', (request, response) => {
  console.log('Info page')
  Person.find({}).then(persons => {
    const personsInfo = `Phonebook has info for ${persons.length} people`
    const date = new Date().toString()
    response.send(`<p>${personsInfo}</p> ${date}`)
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    console.log('Finding persons')
    response.json(persons)
  })
})

/*To be changed*/
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)
  if (person) {
    console.log(`person ${person.name} found`)
    response.json(person)
  } else {
    console.log('person not found')
    response.status(404).end()
  }
})

/*To be changed*/
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)
  response.status(204).end()
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
  } else if (1 === 2) {
    return response.status(400).json({
      error: 'name must be unique'
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

const PORT = process.env.PORT || 3001
app.listen(PORT), () => {
  console.log(`Server running on port ${PORT}`)
}