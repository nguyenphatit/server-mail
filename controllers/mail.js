const mongoose = require('mongoose');
const validateMailInput = require('../validation/mail');

const Mail = require('./../models/Mail');
const User = require('./../models/User');

exports.sendmail = (req, res, next) => {
    const { errors, isValid } = validateMailInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    } else {
        User.findOne({
            email: req.body.receiver
        }).then(receiver => {
            if (receiver) {
                const _idReceiver = receiver._id
                const newMail = new Mail({
                    _id: new mongoose.Types.ObjectId(),
                    sender: req.user._id,
                    userSender: req.user,
                    receiver: _idReceiver,
                    userReceiver: receiver,
                    title: req.body.title,
                    date: new Date(),
                    content: req.body.content,
                    read: false,
                    trash: false,
                })
                newMail.save().then(mail => {
                    res.status(201).json(mail);
                })
            } else {
                res.status(400).json({
                    message: 'Receiver\'s email not found'
                })
            }
        })
    }
}

exports.getAllMailSent = (req, res, next) => {
    const _id = req.user._id;

    User.findOne({ _id })
        .then(user => {
            if (!user) {
                return res.status(404).json({ errors: 'Email not found' })
            }
            Mail.find({ sender: _id })
                .then(mails => {
                    if (mails) {
                        const resMail = [];
                        mails.map(mail => {
                            if (!mail.trash) {
                                resMail.push(mail);
                            }
                        })
                        res.status(200).json(resMail)
                    } else {
                        res.status(200).json({ message: 'No Mail Send' })
                    }
                })
        })
}

exports.getAllMailInbox = (req, res, next) => {
    const _id = req.user._id;
    User.findOne({ _id })
        .then(user => {
            if (!user) {
                return res.status(404).json({ errors: 'Email not found' })
            }
            Mail.find({ receiver: _id })
                .then(mails => {
                    if (mails) {
                        const resMail = [];
                        mails.map(mail => {
                            if (!mail.trash) {
                                resMail.push(mail)
                            }
                        })
                        res.status(200).json(resMail)
                    } else {
                        res.status(200).json({ message: 'No Inbox' })
                    }
                })
        })
}

exports.getAllMailTrash = (req, res, next) => {
    const _id = req.user._id;
    User.find({ _id })
        .then(user => {
            if (!user) {
                return res.status(404).json({ errors: 'Email not found' })
            }
            Mail.find({ $or: [{ sender: _id }, { receiver: _id }] })
                .then(mails => {
                    if (mails) {
                        const resMail = [];
                        mails.map(mail => {
                            if (mail.trash) {
                                resMail.push(mail)
                            }
                        })
                        res.status(200).json(resMail)
                    } else {
                        res.status(200).json({ message: 'No Inbox' })
                    }
                })
        })
}

exports.getMailById = (req, res, next) => {
    const _id = req.params.id
    Mail.findById({ _id })
        .then(mail => {
            if (mail) {
                res.status(200).json(mail)
            } else {
                return res.status(404).json({ errors: 'Not found' })
            }
        })
}

exports.deleteRestoreMail = (req, res, next) => {
    const _id = req.params.id
    Mail.findByIdAndUpdate({ _id })
        .then(mail => {
            if (mail) {
                if (mail.trash) {
                    mail.trash = false;
                    mail.save().then(mail => {
                        res.status(200).json(mail);
                    })
                } else {
                    mail.trash = true;
                    mail.save().then(mail => {
                        res.status(200).json(mail);
                    })
                }
            } else {
                return res.status(404).json({ errors: 'Not found' })
            }
        })
}