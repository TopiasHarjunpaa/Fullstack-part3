const { response, request } = require('express')
const express = require('express')
const req = require('express/lib/request')
const app = express()
const cors = require('cors')
const morgan = require('morgan')

morgan.token('body', function (req, res) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
})

app.use(express.json())
app.use(express.static('build'))
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  {
    name: "Arto Hellas",
    number: "040-1234567",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  }
]
app.get('/', (request, response) => {
  console.log('Nothing')
  response.send('<h1>Nothing</h1>')
})

app.get('/info', (request, response) => {
  console.log('Info page')
  const personsInfo = `Phonebook has info for ${persons.length} people`
  const date = new Date().toString()
  response.send(`<p>${personsInfo}</p> ${date}`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

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

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if(!body.name) {
    return response.status(400).json({
      error: 'name is missing'
    })
  } else if (!body.number) {
    return response.status(400).json({
      error: 'number is missing'
    })    
  } else if (persons.find(p => p.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })      
  } else {
    const person = {
      name: body.name,
      number: body.number,
      id: Math.floor(Math.random()*10000)
    }

    console.log(person)
    persons = persons.concat(person)
    
    response.json(person)

  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT), () => {
  console.log(`Server running on port ${PORT}`)
}