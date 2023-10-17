const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {

  let customError = {
    //set default
    //here, we want to access the mongoose error is the error throw is not the instance of the one we created.
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "something went wrong try again later"
  }

  //I can decide to comment this instance out and the CustomAPIError will still work
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message })
  }


  //here if we check the error coming from mongoose , we will check what it is talking about  then change out customErri status code and messge and then return it down. Note:You don't return in the if, we just change the variable that's why we started with "let"

  // if (err.name === "ValidationError") {
  //   //Making more better Error for email and password validation thrown by mongoose since we validate registeration by mongoose
  //   console.log(Object.values(err.errors));
  //   customError.msg = Object.values(err.errors).map((item) => item.message).join(",")
  //   customError.statusCode = 400
  // }
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicated value entered for ${Object.keys(err.keyValue)} field,please chose another value `,
      customError.statusCode = 400
  }

  if(err.name ==="CastError"){
    customError.msg = `No item found with id :${err.value}`;
    customError.statusCode= 404
  }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware
