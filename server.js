const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

//creates the express server on a specified port
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
//lets us pass json
app.use(express.json());




//database uri - uniform resource identifier
const uri = process.env.ATLAS_URI;
// console.log('uri', uri);
mongoose.connect( uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err) => {
    // console.log('got error', err);
} );


//establishes connection to database
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established");
})




//require the route files
// const exercisesRouter = require('./routes/exercises');
const usersRouter = require('./routes/users.route');
// const highRouter = require('./routes/high')
// const scrapeRouter = require('./routes/scrape')

//now when a user goes to url(endpoint below)
//it will use the relevant file specified above
// app.use('/exercises', exercisesRouter);
app.use('/user', usersRouter);
app.use('/user/signup', usersRouter);
app.use('/user/login', usersRouter);
app.use('/user/dashboard', usersRouter);
// app.use('/proxy', highRouter);
// app.use('/scrape', scrapeRouter);

//


//starts the server listening on a certain port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})
