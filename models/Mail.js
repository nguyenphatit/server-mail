const mongoose = require('mongoose');

const MailSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String },
    date: { type: Date },
    content: { type: String },
    trash: { type: Boolean }
});

const Mail = mongoose.model('mails', MailSchema);

module.exports = Mail;