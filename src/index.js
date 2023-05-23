require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const { token } = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

token('body', (req) => {
    return JSON.stringify(req.body)
})

const app = express()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'))

const PORT = process.env.PORT

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if(error.name === 'CastError'){
        response.status(400).send({error:'malformatted id'})
    } else if (error.name === 'ValidationError') {
        response.status(400).send({ error: error.message })  
    }
    next(error)
}

app.get('/info', (request, response) => {
    const currDate = new Date()
    Person.find({}).then(persons => {
        response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${currDate.toUTCString()}</p>`)
    })
})

app.get('/persons', (request, response, next) => {
    Person.find({})
        .then(persons => response.json(persons))
        .catch(error => next(error))
})

app.get('/persons/:id', (request, response, next) => {
    Person
        .findById(request.params.id)
        .then(person => {
            if(person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.post('/persons', (request, response, next) => {
    const personSent = request.body

    if (!personSent.name || !personSent.number) {
        return response.status(400).json({ 'error': 'name and number must be in request' })
    }

    const person = new Person(request.body)
    person.save()
        .then(personOnServer => response.json(personOnServer))
        .catch(error => next(error))
})

app.delete('/persons/:id', (request, response, next) => {
    Person
        .findByIdAndRemove(request.params.id)
        .then(response.status(200).end())
        .catch(error => next(error))
})

app.put('/persons/:id', (request, response, next) => {
    const newPerson = {
        name: request.body.name,
        number: request.body.number
    }
    Person
        .findByIdAndUpdate(request.params.id, newPerson, { new: true, runValidators:true, context:'query' })
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error))
})

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})