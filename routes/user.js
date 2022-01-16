const router = require('express').Router()
//Bring in user registration function
const {userRegister, userLogin, userAuth, checkRole, serializeUser} = require('../Utils/Auth')

//users registration routes
router.post('/register-user', async(req, res) =>{
   await userRegister(req.body, 'user', res)
})

//admin registration routes
router.post('/register-admin', async(req, res) =>{
    await userRegister(req.body, 'admin', res)

})

//super admin registration route
router.post('/register-super-admin', async(req, res) =>{
    await userRegister(req.body, 'superadmin', res)

})

//users login routes
router.post('/login-user', async(req, res) =>{
    await userLogin(req.body, 'user', res)

})
//admin login routes
router.post('/login-admin', async(req, res) =>{
    await userLogin(req.body, 'admin', res)

})

//super admin login route
router.post('/login-super-admin', async(req, res) =>{
    await userLogin(req.body, 'superadmin', res)

})
//profile route
 router.get('/profile', userAuth, async(req, res) =>{

    return res.status(201).json(serializeUser(req.user))
 })

//users protected routes
router.get('/user-protected',userAuth,checkRole(['user']), async(req, res) =>{
    return res.status(201).json('Hello User')

})

//admin protected routes
router.get('/admin-protected',userAuth, checkRole(['admin']),async(req, res) =>{
    return res.status(201).json('Hello Admin')
})

//super admin protected route
router.get('/super-admin-protected',userAuth,checkRole(['super-admin']), async(req, res) =>{
    return res.status(201).json('Hello superAdmin')
})
//super-admin and admin  protected route
router.get('/super-admin-and-admin-protected',userAuth,checkRole(['superadmin', 'admin']), async(req, res) =>{
    return res.status(201).json('Hello super admin and admin')
})




module.exports = router