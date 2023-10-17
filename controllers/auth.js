const User = require("../models/User")
const { StatusCodes } = require("http-status-codes")
const { BadRequestError, UnauthenticatedError } = require("../errors/index")
const CustomAPIError = require("../errors/custom-api")




const register = async (req, res) => {



  // const { name, email, password } = req.body;

  // const userExist = await User.findOne({ email });

  // if (userExist) {

  //   throw new Error("user exist")
  // }

  // const salt = await bcrypt.genSalt(10);
  // console.log(salt);
  // const hashedPassword = await bcrypt.hash(password,salt)
  // //note: For tempuserObject,you must pass in the whole properties of req.body or mongose will throw an error. Again, we used Es16 shortcort {name:name,email:email, password:hashedPassword}
  // const tempUser = { name, email, password: hashedPassword }

  const user = await User.create({ ...req.body });
  //once the user is created, we already has the instance method, i.e UserSchema.methods.createJwt, so we will call the user.createJwt() function
  const token = user.createJwt()

  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}





const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password")
  }

  const user = await User.findOne({ email })

  if (!user) {
    throw new UnauthenticatedError("Invalid Credendials")
  }
  //we can only compare password when we already have a user. 
  //as you call the instance function pass in the password you get from the user as argumenet so the comparism can happen


  //compare password
  const isPasswordCorrect = await user.comparedPassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credendials")
  }

  //esle, then create a token and return it to the user to login

  const token = user.createJwt();

  res.status(StatusCodes.OK).json({ user: { name: user.name }, token })



}

module.exports = {
  register,
  login
}



