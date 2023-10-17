const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors/index")



const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt")
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
}

const getJob = async (req, res) => {

  //w are looking for two things, one is the userID which we will get from the midle way (two) we are loking for the jobId which will come from req.params object of the req
  const {
    user: { userId: userId },
    params: { id: jobId },
  } = req
  //we have to check for bother id, one for createdBy and two by jobId
  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId
  })
  if (!job) {
    throw new NotFoundError(`No job found with  the id ${jobId}`)
  }

  res.status(StatusCodes.OK).json({ job })
}



const createJob = async (req, res) => {
  //we will create createdBy with will be set to the iD of the user befoe creating the document in the database
  req.body.createdBy = req.user.userId;

  const job = await Job.create({ ...req.body })
  //not, naturally req.body has an _id of its own!

  res.status(StatusCodes.CREATED).json({ job })
}



const updateJob = async (req, res) => {
  //the destructuring can come like this
  // const {
  //   user: { userId: userId },
  //   params: { id: jobId } } = req;

  // const job = await Job.findOneAndUpdate({ _id: jobId, createdBy:userId }, req.body, {
  //   new: true,
  //   runValidators: true,
  // });

  //or like this 

  const {
    user: { userId: userId },
    params: { id: jobId },
    body: { company: company, position: position }
  } = req;

  //we can decide to validate the input fields here though mongoose has alread validated them as required each;
  if (!company || !position) {
    throw new NotFoundError("company or position fields cannot be empty")
  }
  const job = await Job.findOneAndUpdate({ _id: jobId, createdBy: userId }, { company, position }, {
    new: true,
    runValidators: true,
  })
  if (!job) {
    throw new NotFoundError(`No job found with id ${jobId}`)
  }

  res.status(StatusCodes.OK).json({ job })
}




const deleteJob = async (req, res) => {

  const { user: { userId: userId }, params: { id: jobId } } = req;
  //This
  // const job = await Job.findOneAndDelete({
  //   _id: jobId,
  //   createdBy: userId
  // })
  //or
  const job = await Job.findByIdAndRemove({
    _id: jobId,
    createdBy: userId
  })


  if (!job) {
    throw new NotFoundError(`No job found with the id ${jobId}`)
  }

  // res.status(StatusCodes.OK).json({ job })
  //we don't need to send back the json
  res.status(StatusCodes.OK).send()

}


module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob
}



