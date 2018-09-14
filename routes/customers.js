//////////////
// Imports //
////////////

const router = require('express').Router();
const mongoose = require('mongoose');

const validateCustomer = require('../validation/validation');

/////////////////////
// Schema & model //
///////////////////

const customerSchema = new mongoose.Schema({
    name: {type: String, required: true, minLength: 4, maxLength: 30},
    phone: {type: Number, required: true, minLength: 5},
    isGold: {type: Boolean, default: false}
});

const Customer = mongoose.model('customer', customerSchema, 'customers');

////////////////////
// POST requests //
//////////////////

router.post('/', async (req, res) => {
    // Validate customer info
    const validation = validateCustomer(req.body);

    // if validation error
    if(validation.error) {
        // respond with 400 status & error message from Joi
        res.status(400).send(validation.error.details[0].message);
    } else {
        // Create new Customer
        let newCustomer = new Customer({
            name: req.body.name,
            phone: req.body.phone,
            isGold: req.body.isGold
        });

        // Save Customer to db & respond with status 200 + newCustomer info
        newCustomer = await newCustomer.save();
        res.status(200).send(newCustomer);
    }
});

///////////////////
// GET requests //
/////////////////

// All customers
router.get('/', async (req, res) => {
    // Find customers
    let customers = await Customer.find();

    // If no customers
    if(customers.length < 1) {
        // Respond with status 404 & message
        res.status(404).send('No available customers');
    } else {
        // Respond with status 200 & list of customers
        res.status(200).send(customers);
    }
});

// Single customer
router.get('/:id', async (req, res) => {
    // Find customer
    let customer = await Customer.findById(req.params.id);
    let customerIdByName = await Customer
        .findOne({ name: customer.name })
        .select({_id: 1});

    console.log(customerIdByName);

    if (!customer) {
        res.status(404).send('No customer by that id');
    } else {
        res.status(200).send(customer);
    }
});

///////////////////
// PUT requests //
/////////////////

router.put('/:id', async (req, res) => {
    const validation = validateCustomer(req.body);

    // If validation error, respond with status 400 & error message
    // Bail early
    if (validation.error) {
        res.status(400).send(validation.error.details[0].message);
        return;
    }

    // Find customer
    // new:true makes the findByIdAndUpdate method return
    // the updated customer instead of the original
    let customerToUpdate = await Customer.findByIdAndUpdate({ _id: req.params.id }, {
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    }, { new: true });

    // If no customer
    if (!customerToUpdate) {
        // respond with status 400 & message
        res.status(404).send('No customer by that id');
    } else {
        // Respond with status 200 & updated customer info
        res.status(200).send(customerToUpdate)
    }
});

//////////////////////
// DELETE requests //
////////////////////

router.delete('/:id', async (req, res) => {
    // Find customer by id + remove it & save the deleted id in customerToDelete
   let customerToDelete = await Customer.findByIdAndRemove(req.params.id) ;

   // If no customer to delete
   if(!customerToDelete) {
       // respond with 404 & message
       res.status(404).send('No customer by that id');
   } else {
       // respond with deleted customer
       res.status(200).send(customerToDelete);
   }
});

///////////////////////
// Helper functions //
/////////////////////



/////////////////////
// Module exports //
///////////////////
module.exports = router;