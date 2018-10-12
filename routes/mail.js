const express = require('express');
const router = express.Router();
// const jwt = require('jsonwebtoken');
const passport = require('passport');
const mail = require('./../controllers/mail');

router.post('/sendmail', passport.authenticate('jwt', {session: false}), mail.sendmail)
router.get('/inbox/:id', passport.authenticate('jwt', {session: false}), mail.getInboxMail)
router.get('/send/:id', passport.authenticate('jwt', {session: false}), mail.getSendMail)
router.get('/:id', passport.authenticate('jwt', {session: false}), mail.getMailContent)
router.get('/changeStatusMail/:id', passport.authenticate('jwt', {session: false}), mail.changeStatusMail)
module.exports = router;