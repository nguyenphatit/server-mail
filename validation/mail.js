const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = validateMailInput = data => {
    let errors = {};
    data.receiver = !isEmpty(data.receiver) ? data.receiver : '';
    data.content = !isEmpty(data.content) ? data.content : '';

    if (!Validator.isEmail(data.receiver)) {
        errors.email = 'Email is invalid';
    }

    if (Validator.isEmpty(data.receiver)) {
        errors.email = 'Email is required';
    }

    if (Validator.isEmpty(data.content)) {
        errors.content = 'Content is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}