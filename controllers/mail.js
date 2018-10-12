const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
                            receiver: _idReceiver,
                            title: req.body.title,
                            date: new Date(),
                            content: req.body.content,
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

// exports.getSend = (req, res, next) => {

//     const email = req.body.email;
//     const _idUser = null;

//     User.findOne({ email })
//         .then(user => {
//             if (!user) {
//                 return res.status(404).json({ errors: 'Email not found' })
//             } else {
//                 const id = user._id
//                 Mail.find({ sender: id })
//                     .then(mails => {
//                         if (mails) {
//                             const resMail = [];
//                             mails.map(mail => {
//                                 if (!mail.trash) {
//                                     resMail.push(mail);
//                                 }
//                             })
//                             res.status(200).json(resMail)
//                         } else {
//                             res.status(200).json({ message: 'No Mail Send' })
//                         }
//                     })
//             }
//         })
// }

exports.getSendMail = (req, res, next) => {

    const _id = req.params.id;
    const _idUser = null;

    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json({ errors: 'Email not found' })
            } else {
                const id = user._id
                Mail.find({ sender: id })
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
            }
        })
}

// exports.getInbox = (req, res, next) => {
//     const email = req.body.email;
//     const _idUser = null;

//     User.findOne({ email })
//         .then(user => {
//             if (!user) {
//                 return res.status(404).json({ errors: 'Email not found' })
//             } else {
//                 const id = user._id
//                 Mail.find({ receiver: id })
//                     .then(mails => {
//                         if (mails) {
//                             const resMail = [];
//                             mails.map(mail => {
//                                 if (!mail.trash) {
//                                     resMail.push(mail)
//                                 }
//                             })
//                             res.status(200).json(resMail)
//                         } else {
//                             res.status(200).json({ message: 'No Inbox' })
//                         }
//                     })
//             }
//         })
// }

exports.getInboxMail = (req, res, next) => {
    const _id = req.params.id;
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
}

exports.getMailContent = (req, res, next) => {
    const _id = req.params.id;
    Mail.findById({ _id })
        .then(mail => {
            if (mail) {
                res.status(200).json(mail)
            } else {
                res.status(404).json({ errors: 'Not found' })
            }
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