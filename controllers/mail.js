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
            email: req.body.sender
        }).then(sender => {
            if (sender) {
                const _idSender = sender._id
                User.findOne({
                    email: req.body.receiver
                }).then(receiver => {
                    if (receiver) {
                        const _idReceiver = receiver._id
                        const newMail = new Mail({
                            _id: new mongoose.Types.ObjectId(),
                            sender: _idSender,
                            userSender: sender,
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
            } else {
                res.status(400).json({
                    message: 'Sender\'s email not found'
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

exports.getMailSent = (req, res, next) => {
    const _id = req.params.id;
    const sender = req.user._id;
    Mail.find({ _id, sender })
        .then(mail => {
            if (mail) {
                res.status(200).json(mail)
            } else {
                return res.status(404).json({ message: 'No Sent' })
            }
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

exports.getMailInbox = (req, res, next) => {
    const _id = req.params.id;
    const receiver = req.user._id;
    Mail.find({ _id, receiver })
        .then(mail => {
            if (mail) {
                res.status(200).json(mail)
            } else {
                return res.status(404).json({ message: 'Not found' })
            }
        })

}

exports.getAllMailTrash = (req, res, next) => {
    const _id = req.user._id;
    User.findOne({ _id })
        .then(user => {
            if (!user) {
                return res.status(404).json({ errors: 'Email not found' })
            }
            Mail.find({ $or: [{ sender: _id }, { receiver: _id }] })
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
                        res.status(200).json({ message: 'No Trash' })
                    }
                })
        })

}

exports.changeStatusMail = (req, res, next) => {
    const { _id } = req.params;

    Mail.findById({ _id })
        .then(mail => {
            if (mail) {
                if (mail.trash) {
                    mail.trash = false;
                    res.status(200).json({ message: 'Restored successfully' })
                } else {
                    mail.trash = true;
                    res.status(200).json({ message: 'Removed successfully' })
                }
            } else {
                res.status(404).json({ errors: 'Not found' })
            }
        })
}