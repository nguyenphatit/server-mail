const express = require('express');
const router = express.Router();
const passport = require('passport');
const mail = require('./../controllers/mail');

router.post('/sendmail', passport.authenticate('jwt', {session: false}), mail.sendmail)
router.get('/sent', passport.authenticate('jwt', {session: false}), mail.getAllMailSent)
router.get('/sent/:id', passport.authenticate('jwt', {session: false}), mail.getMailSent)
router.get('/inbox', passport.authenticate('jwt', {session: false}), mail.getAllMailInbox)
router.get('/inbox/:id', passport.authenticate('jwt', {session: false}), mail.getMailInbox)
router.get('/trash', passport.authenticate('jwt', {session: false}), mail.getAllMailTrash)

router.get('/changeStatusMail/:id', passport.authenticate('jwt', {session: false}), mail.changeStatusMail)
module.exports = router;