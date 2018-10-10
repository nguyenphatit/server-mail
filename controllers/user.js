const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

const User = require('./../models/User');

exports.register = (req, res, next) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }
    User.findOne({
        email: req.body.email
    }).then(user => {
        if (user) {
            return res.status(400).json({
                email: 'Email already exists'
            });
        } else {
            const avatar = gravatar.url(req.body.email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });
            const newUser = new User({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                avatar: avatar,
                birthday: req.body.birthday,
                password: req.body.password,
                phone: req.body.phone,
                address: req.body.address
            })

            bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                    console.log('There was an error', err)
                } else {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) {
                            console.log('There was an error', err)
                        } else {
                            newUser.password = hash;
                            newUser.save().then(user => {
                                res.status(201).json(user)
                            })
                        }
                    })
                }
            })
        }
    })
}

exports.login = (req, res, next) => {
    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email })
        .then(user => {
            if (!user) {
                errors.email = 'User not found'
                return res.status(404).json(errors);
            }
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        const payload = {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar
                        }
                        jwt.sign(payload, 'secret', {
                            expiresIn: 3600
                        }, (err, token) => {
                            if (err) console.error('There is some error in token', err);
                            else {
                                res.json({
                                    success: true,
                                    token: `Bearer ${token}`
                                });
                            }
                        });
                    }
                    else {
                        errors.password = 'Incorrect Password';
                        return res.status(400).json(errors);
                    }
                });
        });
}

exports.authenticate = (req, res, next) => {
    return res.json({
        id: req.user._id,
        firstname: req.user.firstname,
        lastname: req.user.lastname,
        email: req.user.email
    })
}