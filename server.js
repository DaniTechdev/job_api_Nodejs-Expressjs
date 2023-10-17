require('dotenv').config();
require('express-async-errors');

//extra security packages

const helmet = require("helmet")
const cors = require("cors")
const xss = require("xss-clean")
const rateLimiter = require("express-rate-limit");



const express = require('express');
const app = express();
const connectDB = require("./db/connect")

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs")
const authenticateUser = require("./middleware/authentication")



app.use(rateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
}))

app.use(express.json());
// extra packages middlewares for security
app.use(helmet())
app.use(cors())
app.use(xss())



app.get("/", (req, res) => {
  res.send("jobs api ")
})
// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    connectDB(process.env.MONGO_URI)
    console.log("connected to MONGO DB");

    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
