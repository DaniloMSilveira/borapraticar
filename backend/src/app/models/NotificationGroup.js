const mongoose = require('mongoose');

const NotificationGroupSchema = new mongoose.Schema({
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
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

const NotificationGroup = mongoose.model('NotificationGroup', NotificationGroupSchema);

module.exports = NotificationGroup;