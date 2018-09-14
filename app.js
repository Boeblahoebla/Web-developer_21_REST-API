//////////////
// Imports //
////////////
const express = require('express');
const morgan = require ('morgan');
const helmet = require('helmet');
const app = express();

const routeGenres = require('./routes/genres');
const routeCustomers = require('./routes/customers');

const mongoose = require('mongoose');

////////////////////
// DB Connection //
//////////////////
mongoose.connect('mongodb://localhost/vidly', { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log('Could not connect to DB...', err));

//////////////////
// Middle ware //
////////////////
app.use(helmet());
app.use(morgan('tiny'));
app.use(express.json());

app.use('/api/genres/', routeGenres);
app.use('/api/customers/', routeCustomers);


//////////////////
// Server init //
////////////////
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));