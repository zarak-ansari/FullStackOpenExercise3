const mongoose = require('mongoose')

if(process.argv.length < 3){
  console.log("give password as argument to query all and optionally name and number to save new person to db")
  process.exit(1)
}

const password = encodeURI(process.argv[2])

const url = `mongodb+srv://zarakansari:${password}@cluster0.8hgx1me.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)


const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 3) {

  console.log("phonebook:")

  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
  
} else if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]
  
  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log("error: invalid number of arguments")
  process.exit(1)
}