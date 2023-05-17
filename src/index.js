const express = require('express')
const morgan = require('morgan')
const { token } = require('morgan');

token('body', (req) => {
    return JSON.stringify(req.body);
  })

const app = express()
app.use(express.json())
// app.use(morgan('tiny'))
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'))

const PORT = 3001

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get("/info", (request, response) => {
    const currDate = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${currDate.toUTCString()}</p>`)
})

app.get("/persons", (request, response) => {
    response.json(persons)
})

app.get("/persons/:id", (request, response) => {
    const requiredId = Number(request.params.id)
    const person = persons.find(person => person.id === requiredId)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.post("/persons", (request, response) => {
    const personSent = request.body

    if (!personSent.name || !personSent.number) {
        return response.status(400).json({ "error": "name and number must be in request" })
    }

    const existingPersonWithSameName = persons.find(person => person.name === personSent.name)
    if (existingPersonWithSameName) {
        return response.status(400).json({ "error": "name already exists" })
    }

    const id = Math.floor(Math.random() * 1000000000)
    const newPerson = { ...personSent, id: id }
    persons = persons.concat(newPerson)
    response.json(newPerson)
})

app.delete("/persons/:id", (request, response) => {
    const requiredId = Number(request.params.id)
    persons = persons.filter(person => person.id !== requiredId)
    response.status(200).end()
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})