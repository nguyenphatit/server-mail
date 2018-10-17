const express = require('express');
const router = express.Router();
const passport = require('passport');
const mail = require('./../controllers/mail');

router.post('/sendmail', passport.authenticate('jwt', {session: false}), mail.sendmail)
router.get('/sent', passport.authenticate('jwt', {session: false}), mail.getAllMailSent)
router.get('/inbox', passport.authenticate('jwt', {session: false}), mail.getAllMailInbox)
router.get('/trash', passport.authenticate('jwt', {session: false}), mail.getAllMailTrash)
router.get('/:id', passport.authenticate('jwt', {session: false}), mail.getMailById)
router.get('/delete-restore/:id', passport.authenticate('jwt', {session: false}), mail.deleteRestoreMail)
router.get('/read/:id', passport.authenticate('jwt', {session: false}), mail.readMail)
module.exports = router;