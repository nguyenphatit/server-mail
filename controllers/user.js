const gravatar = require('gravatar');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

const User = require('./../models/User');

exports.register = (req, res, next) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    } else {
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
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) {
                        console.log('There was an error', err)
                    } else {
                        bcrypt.hash(req.body.password, salt, (err, hash) => {
                            if (err) {
                                console.log('There was an error', err)
                            } else {
                                const newUser = new User({
                                    _id: new mongoose.Types.ObjectId(),
                                    firstname: req.body.firstname,
                                    lastname: req.body.lastname,
                                    birthday: req.body.birthday,
                                    avatar,
                                    email: req.body.email,
                                    password: hash,
                                    phone: req.body.phone,
                                    address: req.body.address
                                })
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
                            expiresIn: 60 * 30
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
        email: req.user.email,
        avatar: req.user.avatar,
        birthday: req.user.birthday,
        phone: req.user.phone,
        address: req.user.address
    })
}