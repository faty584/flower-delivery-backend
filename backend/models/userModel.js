const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const validator = require('validator')
const Schema = mongoose.Schema

const userSchema = new Schema ({
    email:
    {
        type: String,
        unique: true,
    },
    password:
    {
        type: String,
        required: true
    },
     token: { type: String } // optional
})

userSchema.statics.signUp = async function(email, password) {

    //validator
    if (!email || !password) {
        throw Error("All fields must be filled")
    }
  if (!validator.isEmail(email)) {
    throw Error('Email is not valid')
}

if (!validator.isStrongPassword(password)) {
    throw Error('Password is not strong enough')
}

    const exists = await this.findOne({ email })

    if (exists) {
        throw Error('email exists')
    }

    // bcrypt
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({ email, password: hash })

    return user 
 }

module.exports = mongoose.model('User', userSchema)