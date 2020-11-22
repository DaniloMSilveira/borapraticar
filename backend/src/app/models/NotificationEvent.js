const mongoose = require('mongoose');

const NotificationEventSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        require: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    title: {
        type: String,
        require: true,
    },
    text: {
        type: String,
        require: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

const NotificationEvent = mongoose.model('NotificationEvent', NotificationEventSchema);

module.exports = NotificationEvent;