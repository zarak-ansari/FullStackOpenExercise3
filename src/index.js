require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const { token } = require('morgan');
const cors = require('cors')
const Person = require('./models/person')

token('body', (req) => {
    return JSON.stringify(req.body);
})

const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
// app.use(morgan('tiny'))
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'))

const PORT = process.env.PORT

app.get("/info", (request, response) => {
    const currDate = new Date()
    Person.find({}).then(persons => {
        response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${currDate.toUTCString()}</p>`)
    })
})

app.get("/persons", (request, response) => {
    Person.find({}).then(persons => response.json(persons))
})

app.get("/persons/:id", (request, response) => {
    Person
        .findById(request.params.id)
        .then(person => response.json(person))
})

app.post("/persons", (request, response) => {
    const personSent = request.body

    if (!personSent.name || !personSent.number) {
        return response.status(400).json({ "error": "name and number must be in request" })
    }

    const person = new Person(request.body)
    person.save().then(personOnServer => response.json(personOnServer))
})

app.delete("/persons/:id", (request, response) => {
    Person
        .findByIdAndRemove(request.params.id)
        .then(response.status(200).end())
        .catch(err => console.log(err))
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})