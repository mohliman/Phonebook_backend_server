const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json())
app.use(express.static('dist'))
app.use(morgan('tiny'))


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

app.get('/api/persons', (req, res)=>{
    res.json(persons)
})

app.get('/info', (req, res)=>{
    let totalPersons = persons.length;
    const days = ['Sun', 'Mon', 'Tue', 'Wed','Thu', 'Fri', 'Sat']
    const months = ['Jan', 'Feb', 'Mar', 'Apr','May', 'Jun', 'Jul','Aug','sep', 'Oct', 'Nov', 'Dec']

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

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
      }).format(now);

    res.send(`Phonebook has info for ${totalPersons} people <br/> ${day} ${month} ${date} ${year} ${hours}:${minutes}:${seconds} ${timezone}(West African Time)`)
})

app.get('/api/persons/:id', (req, res)=>{
    const id = Number(req.params.id)
    let person = persons.find((person)=>{
        return person.id === id;
    })

    if(person){
        res.json(person)
    }
    else{
        res.status(404).end()
    }
})


app.delete('/api/persons/:id', (req, res)=>{
    const id = Number(req.params.id)
    persons = persons.filter((person)=> person.id !== id)

    res.status(204).end()
})




morgan.token('resp', function (req, res) { return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :resp'))

app.post('/api/persons', (req, res)=>{
    let newID = Math.floor(Math.random()*999999999999999)

    let person = {
        id: newID,
        name: req.body.name,
        number: req.body.number
    }

    let personName = persons.find(personName => personName.name === person.name)

    if(personName){
        return res.status(400).json({error: 'name must be unique'})
    }

    if(person.name && person.number){
        persons = persons.concat(person)
        res.json(person)
    }else{
        res.status(400).json({error: 'name or number is missing'})
    }
})



const PORT = 3001;
app.listen(PORT, ()=>{
    console.log(`server listening at port ${PORT}`);
})
