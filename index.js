require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json())
app.use(express.static('dist'))
app.use(morgan('tiny'))
const Phonebook = require('./models/phonebook')





////////////////////// GET REQUEST ////////////////////

app.get('/api/persons', (req, res, next) => {
  Phonebook.find({})
    .then((result) => {
      res.json(result)
    }).catch(error => next(error))
})



app.get('/api/persons/:id', (req, res, next) => {
  Phonebook.findById(req.params.id).then(result => {
    if(result){
      res.json(result)
    }else{
      res.status(404).end()
    }
  })
    .catch(error => next(error))
})



app.get('/info', (req, res) => {
  Phonebook.find({}).then(result => {
    let totalPersons= result.length
    const days = ['Sun', 'Mon', 'Tue', 'Wed','Thu', 'Fri', 'Sat']
    const months = ['Jan', 'Feb', 'Mar', 'Apr','May', 'Jun', 'Jul','Aug','sep', 'Oct', 'Nov', 'Dec']

    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')

    let day = days[new Date().getDay()]
    let month = months[new Date().getMonth()]
    let date = new Date().getDate()
    let year = new Date().getFullYear()
    let timezone = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Africa/Lagos',
      timeZoneName: 'short',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneOffsetName: 'short',
    }).format(now)

    res.send(`Phonebook has info for ${totalPersons} people <br/> ${day} ${month} ${date} ${year} ${hours}:${minutes}:${seconds} ${timezone}(West African Time)`)
  })
})



morgan.token('resp', function (req) { return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :resp'))


//////////////////////POST REQUESTS////////////////////

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  if(!body.name && !body.number){
    return res.status(400).json({ error: 'name and number missing' })
  }
  let contact = new Phonebook({
    name: body.name,
    number: body.number
  })
  contact.save().then(saveContact => {
    res.json(saveContact)
  }).catch(error => next(error))
})

//////////////////////PUT REQUESTS////////////////////

app.put('/api/persons/:id', (req, res, next) => {
  const { number } = req.body
  Phonebook.findById(req.params.id).then(contact => {
    if(!contact) {
      return res.status(404).end()
    }
    contact.number = number
    return contact.save().then(updatedContact => {
      res.json(updatedContact)
    })
  }).catch(error => next(error))

})




//////////////////////DELETE REQUESTS////////////////////

app.delete('/api/persons/:id', (req, res, next) => {
  Phonebook.findByIdAndDelete(req.params.id).then(() => {
    res.status(204).end()
  }).catch(error => next(error))
})



////////////////////// ERROR HANDLERS////////////////////

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const errorHandler = (error, req, res, next) => {
  console.log(error.message)

  if(error.name === 'CastError'){
    return res.status(400).send({ error: 'malformatted id' })
  }else if(error.name === 'ValidationError'){
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`server listening at port ${PORT}`)
})
