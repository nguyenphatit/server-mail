const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const user = require('./../controllers/user');

router.post('/register', user.register)
router.post('/login', user.login)
router.get('/me', passport.authenticate('jwt', {session: false}), user.authenticate)
router.get('/:id', passport.authenticate('jwt', {session: false}), user.getUserById)

module.exports = router;