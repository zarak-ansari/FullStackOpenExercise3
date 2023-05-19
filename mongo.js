const mongoose = require('mongoose')

if (process.argv.length<5) {
  console.log('give password, name and number as arguments')
  process.exit(1)
}

const password = encodeURI(process.argv[2])
const name = process.argv[3]
const number = process.argv[4]


const url = `mongodb+srv://zarakansari:${password}@cluster0.8hgx1me.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: name,
  number: number,
})

person.save().then(result => {
  console.log(`added ${name} number ${number} to phonebook`)
  mongoose.connection.close()
})