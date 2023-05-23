const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)
mongoose.connect(url)  
  .then(result => {
      console.log('connected to MongoDB')  
    })  
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)  
  })


const personSchema = new mongoose.Schema({
  name: {
    type:String,
    required:true,
    minLength: 3
  },
  number: {
    type:String,
    validate:{
      validator : (value) => {
        return value.length >= 9 && /\d{2,3}-\d{5,}/.test(value) //length is 9 or greater after including dash  
      } 
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)