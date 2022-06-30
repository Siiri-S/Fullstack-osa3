const express = require('express')
const app = express()

const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')
const morgan = require('morgan')

morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(express.json())

app.use(cors())

app.use(express.static('build'))

app.use(
    morgan(':method :url :status :res[content-length] :response-time ms :body')
    )



app.get('/info', (req, res) => {
    Person.find({}).then(people => {
        res.send(
            `<div>
                <p>Phonebook has info for ${people.length} people</p>
                <p>${Date()}</p>
            </div>`
        )
      })
    
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(people => {
      response.json(people)
    })
  })

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
    .then(person => {
        if (person) res.json(person)
        else res.status(404).end()
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res) => {
    Person.findByIdAndRemove(req.params.id)
    .then(result => {
        res.status(204).end()
    })
    .catch(error => next(error))
})


app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({error: 'contact must have name and number'})
    }
    if (persons.map(p => p.name).includes(body.name)) {
        return res.status(400).json({error: 'name must be unique'})
    }

    const person = new Person({
        name: body.name, 
        number: body.number
    }) 

    person.save().then(savedPerson => {
        res.json(savedPerson)
      })
})

app.put('/api/persons/:id', (req, res) => {
    const body = req.body

    const person = {
        name: body.name, 
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, person, {new: true})
    .then(updatedPerson => {
        res.json(updatedPerson)
    })
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }
  
    next(error)
  }

  app.use(errorHandler)
  

const PORT = process.env.PORT 

app.listen(PORT, () => {
  
    console.log(`Server running on port ${PORT}`)
})

