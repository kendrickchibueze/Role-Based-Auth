const cors = require('cors')
const express = require('express')
const bodyParser= require('body-parser')
const {connect } = require('mongoose')
const {success, error} = require('consola')
const userRoute = require('./routes/user')
const passport  = require('passport')


//bring in app constants
const { DB, PORT } = require('./config')

//initialize the application
const app  = express()

//middlewares
 app.use(cors())
app.use(bodyParser.json())
app.use(passport.initialize())

require('./middlewares/passport')(passport)


//user router middleware
app.use('/users', userRoute)




//connection with the db

const startApp = async() =>{
    try{
      await connect(DB, {
     useNewUrlParser: true,
     useUnifiedTopology: true
   })
    success(
       {
        message:`Successfully connected with the database \n${DB}`,
        badge : true
        })

     app.listen(PORT, () =>
      success({message:`Server started on ${PORT}`, badge : true}))

    }catch(err){
        error({
      message:`Unable to connect  with the database \n${err}`,
      badge : true
    })
    startApp()
    }
}


startApp()