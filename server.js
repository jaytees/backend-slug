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

const outletRouter = require('./routes/outlet.route');
const usersRouter = require('./routes/users.route');
const nytimesRouter = require('./routes/nytimes.route');
const hsRouter = require('./routes/hs.route')
const slamcityRouter = require('./routes/slamcity.route')
const pandpRouter = require('./routes/pandp.route')

//now when a user goes to url(endpoint below)
//it will use the relevant file specified above
app.use('/outlet', outletRouter);
app.use('/user', usersRouter);


app.use('/nytimes', nytimesRouter);
app.use('/hs', hsRouter);
app.use('/slamcity', slamcityRouter);
app.use('/pandp', pandpRouter);



//starts the server listening on a certain port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})
