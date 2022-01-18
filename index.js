const { response, request } = require('express')
const express = require('express')
const app = express()

app.use(express.json())

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

const PORT = 3001
app.listen(PORT), () => {
  console.log(`Server running on port ${PORT}`)
}