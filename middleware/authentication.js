const User = require("../models/User")
const jwt = require("jsonwebtoken")
const { UnauthenticatedError } = require("../errors");
const { login } = require("../controllers/auth");
//since we have index.js having all the errors no need of specifying the path to the end

const auth = (req, res, next) => {
  //check header
  const authHeader = req.headers.authorization;
  // if (!authHeader || !authHeader.startsWith("Bearer ")) {
  //   throw new UnauthenticatedError("Authentication invalid")
  // }

  // console.log(tokenProvided);

  // const token = authHeader.split(" ")[1]
  // console.log(token);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("No token provided")
  }

  const token = authHeader.split(" ")[1];
  console.log("token", token);
  try {
    //as we recieved back the token and verify it here, the content of the payload of the token contains the user id which we saved in userId property name. This is the ID that will be passed into req.body in other to determine the real user inside any resource the authentication allowed! That real user will be added to any logic in the controller by CreatedBy:userId
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("payload",payload,);
    //attach the user to the job routes using req way or passit like that.
    //we are pretty much pass
    req.user = { userId: payload.userId, name: payload.name }
    console.log(req.user);
    // console.log("req.User",req.User);
    next()
    //someone can decide to get the user like this and attach it to the route next(), they used User.select("-password") to remove password from the User object
    //  const user  = User.findById(payload.id).select("-password")

  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid")
  }
}

module.exports = auth