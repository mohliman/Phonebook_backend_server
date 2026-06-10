const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]


const url = `mongodb://baqir:${password}@ac-pdej8e8-shard-00-00.alttv6v.mongodb.net:27017,ac-pdej8e8-shard-00-01.alttv6v.mongodb.net:27017,ac-pdej8e8-shard-00-02.alttv6v.mongodb.net:27017/phonebook?ssl=true&replicaSet=atlas-gl9o8n-shard-0&authSource=admin&appName=Cluster0`

mongoose.set('strictQuery', false)

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: Number
})

const Phonebook = mongoose.model('Phonebook', phonebookSchema)

mongoose.connect(url, { family: 4 })
  .then( () => {
    console.log('database connection successful')
    const entry = new Phonebook({
      name,
      number
    })
    if(process.argv.length === 3){
      Phonebook.find({})
        .then(result => {
          const res = result.map(entry => `${entry.name} ${entry.number}`)
          console.log(`Phonebook:\n${res.join('\n')}`)
          mongoose.connection.close()
        })
        .catch(err => console.log('no entries found', err))
    } else {
      entry.save()
        .then( () => {
          console.log('contact saved')
          console.log(`added ${name} number ${number} to phonebook`)
          mongoose.connection.close()
        })
        .catch(err => console.log('saving failed', err))
    }
  })
  .catch(err => console.log('connection failed', err))






