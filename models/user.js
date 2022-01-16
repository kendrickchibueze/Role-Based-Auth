const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    name :{
        type: String,
        required: true
    },
    email :{
        type: String,
        required: true
    },
    role :{
        type: String,
        default: 'user',
        enum: ['admin', 'user', 'superadmin']
    },
    username :{
        type: String,
        required: true
    },
    password :{
        type: String,
        required: true
    }

},
{timestamps:true}
)

module.exports = mongoose.model('Users', userSchema)