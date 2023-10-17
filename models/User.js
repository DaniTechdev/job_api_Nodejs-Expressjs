const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide name"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, "please provide email"],
    match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "please provide valid email",],
    unique: true
  },
  password: {
    type: String,
    required: [true, "please provide password"],
    minlength: 6,
  }
})
//this is a mongoose middleware that hashes the password at the ponint the document is to be saved at inside mongo database

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  //this keyword here by scope represent the document of userScheme in the database/created user, since it is found inside a function and it is global. We will use it to access the password

  //we can still remove the next and this will still work
  this.password = await bcrypt.hash(this.password, salt)
  next()
})



//here we are trying to use mongoose instance method to access the name of a user schema. In rule states that any created schema has an instance method object in which we can define a function on.
// UserSchema.methods.getName = function(){
//   return this.name
// }

//if we like we pass the //next to it as it is still a middle way

UserSchema.methods.createJwt = function () {
//here as we sign the user,we send it back to font-end together with that users id coming from the database (this._id ) 
  return jwt.sign({ userId: this._id, name: this.name, }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  })
  return token
}

//we will use the user schema instance method to create a function to compare the password coming from the user request(candidatePassword) to the one on the database

UserSchema.methods.comparedPassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password)

  return isMatch
}


module.exports = mongoose.model("User", UserSchema)