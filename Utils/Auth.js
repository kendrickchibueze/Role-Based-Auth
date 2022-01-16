const Users =  require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const passport  = require('passport')
const {SECRET} = require('../config/index')


/**
 * @Desc To register the user (ADMIN. SUPER_ADMIN, USER)
 */

const userRegister = async(userDets, role, res) =>{
    //validate the username
    //the req.body is the userDets

   try {
    let usernameNotTaken = await validateUsername(userDets.username)
    if(!usernameNotTaken){
        return res.status(404).json({
            message:"username is already taken",
            success: false
        })
    }

    //validate email
    let emailNotRegistered = await validateEmail(userDets.email)
    if(!emailNotRegistered){
        return res.status(404).json({
            message:"Email is already registered",
            success: false
        })
    }
 //Get the harshed password
 const harshPassword = await bcrypt.hash(userDets.password, 12)
 //create a new user
 const newUser = new Users({
     ...userDets,
     password:harshPassword,
     role:role
 })
 await newUser.save()
 return res.status(201).json({
     message:"You are successfully registered. Please now login",
     success:true
 })

   } catch (error) {
       //you can implement logger function (winston)
       return res.status(500).json({
        message:"Unable to create an account",
        success:false
    })
   }

}
/**
 * @Desc To login the user (ADMIN. SUPER_ADMIN, USER)
 */

const userLogin = async (userCreds, role, res)=> {
    //the req.body is the userCreds
    let {username, password} = userCreds
    //first check if the username is in the database
    const user = await Users.findOne({username})
    if(!user){
        return res.status(404).json({
            message:"Username is not found. Invalid user credentials",
            success:false
        })
    }

    //we will check the roles
    if(user.role !== role){
        return res.status(403).json({
            message:"Please make sure you are logging in from the right portal",
            success:false
        })

    }
    //That means user is existing and trying to signin from the right portal
    //now, check for the password match

    let isMatch  = await bcrypt.compare(password, user.password)
    if(isMatch){
        //signin the token and issue it to the user
        let token = jwt.sign({
            user_id:user._id,
            role:user.role,
            username:user.username,
            email:user.email
        }, SECRET, {expiresIn:"7 days"})

        let result = {
            username:user.username,
            role:user.role,
            email:user.email,
            token:`Bearer ${token}`,
            expiresIn : 168

        }
        return res.status(201).json({
            ...result,
            message:"You are now logged in",
            success:true
        })

    }else{
        return res.status(403).json({
            message:"Incorrect password",
            success:false
        })
    }


}

/**
 * @DESC passport middleware
 */
const userAuth = passport.authenticate('jwt', { session:false})

/**
 * @DESC check role middleware
 *
 */
// const checkRole = (roles) =>(req, res, next)=> {
//      if(roles.includes(req.user.role)){
//          next()
//      }
//      res.status(401).json({
//          message: 'Umauthorized',
//          success: false
//      })
// }
const checkRole = (roles) =>(req, res, next) =>
!roles.includes(req.user.role)? res.status(401).json('unauthorized'):next()





const validateUsername = async (username) =>{
   let user =  await Users.findOne({username});
   return user ? false: true
}
const validateEmail = async (email) =>{
    let user = await Users.findOne({email});
    return user ? false: true
 }

const serializeUser =  (user) =>{
    return {
        username:user.username,
        email:user.email,
        name:user.name,
        _id:user._id,
        updatedAt:user.updatedAt,
        createdAt:user.createdAt
    }
}



 module.exports = {
     userAuth,
     userRegister,
     userLogin,
     serializeUser,
     checkRole
 }