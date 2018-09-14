//////////////
// Imports //
////////////

const Joi = require('joi');

///////////////////////
// Data- validation //
/////////////////////

// Customer validation
module.exports = function validateCustomer(customer) {
    const rules = {
        name: Joi.string().min(4).max(30).required( ),
        phone: Joi.number().min(5).required(),
        isGold: Joi.boolean()
    };

    return Joi.validate(customer, rules);
};

// Genre validation
module.exports = function validateGenre(genre) {
    const rules = {
        name: Joi.string().min(4).max(30).required(),
    };

    return Joi.validate(genre, rules)
};