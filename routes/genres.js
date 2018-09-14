//////////////
// Imports //
////////////
const router = require('express').Router();
const mongoose = require('mongoose');

const validateGenre = require('../validation/validation');


/////////////////////
// Schema & model //
///////////////////

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    }
});

const Genre = mongoose.model('genre', genreSchema, 'genres');

///////////////////
// GET requests //
/////////////////

// All genres
router.get('/', async (req, res) => {
    const genresToFind = await Genre.find().sort('name');

    // if not available send status 404
    if(!genresToFind) {
        res.status(404).send('No genre available by that id');
    } else {
        // if available send status 200 with genre object(s)
        res.status(200).send(genresToFind);
    }

});

// A genre by id
router.get('/:id', async (req, res) => {
    const genreToFind = await Genre.findById(req.params.id);

    // if not available send status 404
    if(!genreToFind) {
        res.status(404).send('No genre available by that id');
    } else {
        // if available send status 200 with genre object
        res.status(200).send(genreToFind);
    }
});

////////////////////
// POST requests //
//////////////////

// New genre
router.post('/', async (req, res) => {
    // Validate request
    const validation = validateGenre(req.body);

    console.log(req.body);

    // If not validated send status 400 & error
    if(validation.error) {
        res.status(400).send(validation.error.details[0].message);
    } else {
        // If validated, create new genre object
        let newGenre = new Genre({ name: req.body.name });
        newGenre = await newGenre.save();

        // Send status 200 and new genre object
        res.status(200).send(newGenre);
    }
});

///////////////////
// PUT requests //
/////////////////

// Update a genre
router.put('/:id', async (req, res) => {
    // Validate the input
    const validation = validateGenre(req.body);

    // If not validated send status 400 with error
    if(validation.error) {
        res.status(400).send(validation.error.details[0].message);
        return;
    }

    const genreToUpdate = await Genre.findOneAndUpdate({ _id: req.params.id }, { name: req.body.name }, {
        new: true
    });

    // If not found exit
    if (!genreToUpdate) {
        res.status(404).send("No genre matching your criteria");
        return;
    }

    // Respond status 200 & send updated genre
    res.status(200).send(genreToUpdate);
});

//////////////////////
// DELETE requests //
////////////////////

// Delete a genre
router.delete('/:id', async (req, res) => {

    const genreToDelete = await Genre.findByIdAndRemove(req.params.id)

    // If not a match respond with status 400
    if(!genreToDelete) {
        res.status(404).send("No genre matching your criteria");
    } else {
        // Respond with deleted data
        res.status(200).send(genreToDelete);
    }
});

///////////////////////
// Helper functions //
/////////////////////

/*// Validation
const validateGenre = (genre) => {
    const schema = {
        name: Joi.string().min(4).max(30).required()
    };

    return Joi.validate(genre, schema);
};*/

/////////////////////
// Module exports //
///////////////////
module.exports = router;

